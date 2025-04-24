/**
 * @module clientSearchTools
 * @description Helper functions for searching DB during user input steps
 */

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


/**
 * Query for live search function
 * @param {string} type 
 * @param {string} artist 
 * @param {string} q 
 * @returns {Array} list of 20 results
 */
export async function liveSearch (type, artist, q) {

    // Simple way to watch how slow the livesearch is and become sad
    console.log(`livesearch firing: ${type}, ${artist}, ${q}`)
    const queryStart = performance.now()



    let results

    ///////////////// ARTIST
    if (type === 'artist') {
        results = await db`
            SELECT
                artist.name

            FROM
                artist
            
            order by artist.name_search <-> ${q}  
              
            LIMIT 20;`
    }


    //////////////// ALBUM/TRACK
    // This query needs to be
    // 1. Split into album and track. Having the fancy dynamic query block isn't worth the 
    // headache of reading it
    // 2. optimized, somehow. For tracks its a decision between being slow and producing
    // hundreds of duplicates. Could be solved if the database tables were reformatted and deduped
    else {
        results = await db`
            SELECT
                ${db(type)}.title,
                artist.name

            FROM 
                ${db(type)}

            JOIN artist_credit 
            ON artist_credit.id = ${db(type)}.artist_credit

            JOIN artist
            ON artist.id = artist_credit.artist_id

            ${type === 'track' ? 
                db`
                JOIN album_variations av
                ON track.album_id = av.id
                
                JOIN album
                ON av.album_group = album.id`
                : 
                db``}
            
            WHERE
                artist.id != 1
                AND artist.name_search % ${artist}
                AND ${db(type)}.title_search LIKE ${q} || '%'
                AND 'Single' <> ALL(album.release_type) 
                AND 'Compilation' <> ALL(album.release_type)

            GROUP BY ${db(type)}.title, track.id, artist.name
            ORDER BY ${db(type)}.title, ${db(type)}.id
            
            LIMIT 20;
        `
    }

    const queryEnd = performance.now()
    console.log(`finished query in ${queryEnd - queryStart}ms`)
    return results
}


/**
 * Query for final user input info which displays on the filled form
 * @param {string} type 
 * @param {string} artist 
 * @param {string} title 
 * @param {string} token 
 * @returns 
 */
export async function inputDisplaySearch(type, artist, title, token) {
    const nArtist = normalizeString(artist)
    const nTitle = title ? normalizeString(title) : title

    let result

    //////////////// ARTIST
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

    
    // Album and track can occasionally be very slow.
    // These queries attempt to balance speed with light fuzzy matching for typos
    // or weird titles
    // could consider removing fuzzy match for efficiency
    /////////////////// ALBUM
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


    ////////////// TRACK
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

    // send nulls back to client for error handling
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


/**
 * Grab a spotify artist image if available
 * @param {string} artist 
 * @param {string} token 
 * @returns {string} image link, or null
 */
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

/**
 * removes spaces, punctuation, and unaccents a string
 * for easier db searches
 * @param {string} string to be normalized
 * @returns 
 */
export function normalizeString(string) {
    return string
    .toLowerCase()
    .normalize('NFD')                     
    .replace(/[\u0300-\u036f]/g, '')      
    .replace(/[^a-z0-9\s]/g, '')         
    .replace(/\s+/g, '')                  
    .trim()
}