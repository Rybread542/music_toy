import { dbHost, dbPort, dbUser, dbPass, dbName } from './dotenv.mjs'
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
    artist = artist
        .toLowerCase()
        .normalize('NFD')                     
        .replace(/[\u0300-\u036f]/g, '')      
        .replace(/[^a-z0-9\s]/g, '')         
        .replace(/\s+/g, '')                  
        .trim()
        
    const nukeSingles = db`AND 'Single' <> ALL(album.release_type) AND 'Compilation' <> ALL(album.release_type)`

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
            
            WHERE
                artist.id != 1
                AND artist.name_search = ${artist}
                AND ${db(type)}.title_search LIKE ${q + '%'}
                ${type === 'album' ? nukeSingles : db``}

            GROUP BY
            ${db(type)}.title, ${db(type)}.id, artist.id, artist.name
            
            
            LIMIT 20;
        `
    }

    const queryEnd = performance.now()
    console.log(`finished query in ${queryEnd - queryStart}ms`)
    return results
}