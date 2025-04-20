import { dbHost, dbPort, dbUser, dbPass, dbName } from './dotenv.mjs'
import { getAlbumArt, getSpotifySearchParams } from '../algo_utils/musicLinks.mjs'
import postgres from 'postgres'



const db_details = {
    host : dbHost,
    port : dbPort,
    username : dbUser,
    password : dbPass,
    database : dbName  
}


const db = postgres(db_details)

export async function liveSearch (type, artist, q) {

    console.log(`livesearch firing artist: ${type}, ${artist}, ${q}`)
    const queryStart = performance.now()
    let results
    if (type === 'artist') {
        results = await db`
            SELECT
                artist.name,
                similarity(artist.name_search, ${q}) sim

            FROM
                artist
            
            where artist.name_search % ${q}
            
            group by artist.name, artist.id
            order by sim desc,   
            artist.id asc
              
            
            LIMIT 20;`
    }

    else {
        results = await db`
            SELECT DISTINCT ON (${db(type)}.title)
                ${db(type)}.title,
                artist.name

            FROM 
                ${db(type)}

            LEFT JOIN artist_credit 
            ON artist_credit.id = ${db(type)}.artist_credit

            LEFT JOIN artist
            ON artist.id = artist_credit.artist_id

            ${type === 'track' ? 
                db`
                LEFT JOIN album_variations av
                ON track.album_id = av.id
                
                LEFT JOIN album
                ON av.album_group = album.id`
                : 
                db``}
            
            WHERE
                artist.id != 1
                AND artist.name_search % ${artist}
                AND ${db(type)}.title_search LIKE ${q + '%'}
                AND 'Single' <> ALL(album.release_type) AND 'Compilation' <> ALL(album.release_type)

            GROUP BY
            ${db(type)}.title, ${db(type)}.id, artist.id, artist.name
            
            
            LIMIT 20;
        `
    }

    const queryEnd = performance.now()
    console.log(`finished query in ${queryEnd - queryStart}ms`)
    return results
}

export async function inputDisplaySearch(type, artist, title, token) {
    const nArtist = normalizeString(artist)
    const nTitle = title ? normalizeString(title) : title

    let result

    if(type ==='artist') {
        result = await db`
            SELECT
                art.name,
                art.cleaned_tags,
                similarity(art.name_search, ${nArtist}) asim
                
            FROM artist art
            
            WHERE art.name_search % ${nArtist}

            ORDER BY asim desc, art.id asc
            
            LIMIT 1;`
    }

    else if(type==='album') {
        result = await db`
            SELECT
                art.name,
                alb.title,
                alb.release_year,
                alb.gid,
                similarity(alb.title_search, ${nTitle}) tsim,
                similarity(art.name_search, ${nArtist}) asim
                
            FROM
                album alb
                
            LEFT JOIN artist_credit ac
            ON ac.id = alb.artist_credit
            
            LEFT JOIN artist art
            ON art.id = ac.artist_id
            
            WHERE art.name_search % ${nArtist}
            AND alb.title_search % ${nTitle}
            AND 'Single' <> ALL(alb.release_type) 
            AND 'Compilation' <> ALL(alb.release_type)
            
            ORDER BY asim desc, tsim desc
            
            LIMIT 1;`
    }

    else {
        result = await db`
            SELECT
                art.name,
                tr.title,
                alb.gid,
                alb.release_year,
                similarity(tr.title_search, ${nTitle}) tsim,
                similarity(art.name_search, ${nArtist}) asim
                
            FROM
                
                track tr
                
            JOIN artist_credit ac
            ON ac.id = tr.artist_credit
            
            JOIN artist art
            ON art.id = ac.artist_id

            JOIN album_variations av
            ON av.id = tr.album_id

            JOIN album alb
            ON alb.id = av.album_group

            WHERE art.name_search % ${nArtist}
            AND tr.title_search % ${nTitle}

            ORDER BY asim desc, tsim desc, tr.id asc

            LIMIT 1;
            `
    }

    const data = result[0]

    console.log(result)

    const resultArtist = data?.name ?? null
    const resultTitle = data?.title ?? null
    const resultYear = data?.release_year ?? null
    const resultGenres = data?.cleaned_tags ?? null

    const resultMBID = data?.gid ?? null

    let resultImg = type != 'artist' ? await getAlbumArt(resultMBID) : await spotifyArtistImg(nArtist, token)

    return {
        resultArtist,
        resultTitle,
        resultImg,
        resultYear,
        resultGenres
    }
}

async function spotifyArtistImg(artist, token) {
    const q = `${artist}&type=artist&limit=1`

    let params = getSpotifySearchParams(token)

    let searchData = await fetch(`https://api.spotify.com/v1/search?q=${q}`, params)

    let data = await searchData.json()

    if (data.error) {
        console.log(`error retrieving artist img: ${data.error.status} ${data.error.message}`)
        return null
    }

    try {
        const resultImg = data.artists.items[0].images[0].url
        return resultImg
    }

    catch {
        return null
    }
}

export function normalizeString(string) {
    return string
    .toLowerCase()
    .normalize('NFD')                     
    .replace(/[\u0300-\u036f]/g, '')      
    .replace(/[^a-z0-9\s]/g, '')         
    .replace(/\s+/g, '')                  
    .trim()
}