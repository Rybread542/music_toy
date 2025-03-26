require('dotenv').config({path: '../.env'})
const postgres = require('postgres')



const db_details = {
    host : process.env.DB_HOST,
    port : process.env.DB_PORT,
    username : process.env.DB_USER,
    password : process.env.DB_PASS,
    database : process.env.DB_NAME   
}


const db = postgres(db_details)

async function liveSearch (type, artist, q) {
    const artistWhere = db`AND artist.name ILIKE ${artist}`
    const nukeSingles = db`AND 'Single' <> ALL(album.release_type) AND 'Compilation' <> ALL(album.release_type)`
    const distinctTracks = db`DISTINCT ON (${db(type)}.title)`
    const distinctTrackOrderBy = db`track.title, `

    let results
    if (type === 'artist') {
        results = await db`
            SELECT
                artist.name,
                similarity(artist.name_search, ${q}) as sim
            
            FROM
                artist
            
            where artist.name_search % ${q}
            
            group by artist.name, artist.id
            order by sim desc, artist.id asc     
            
            LIMIT 5;`
    }

    else {
        results = await db`
            SELECT DISTINCT ON (${db(type)}.title)
                ${db(type)}.title
                ${artist ? db`` : db`, artist.name`}

            FROM 
                ${db(type)}

            LEFT JOIN artist_credit 
            ON artist_credit.id = ${db(type)}.artist_credit

            LEFT JOIN artist
            ON artist.id = artist_credit.artist_id
            
            WHERE
                artist.id != 1
                AND ${db(type)}.title_search % ${q} || '%'
                ${artist ? artistWhere : db``}
                ${type === 'album' ? nukeSingles : db``}
            

            GROUP BY
            ${db(type)}.title, ${db(type)}.id, artist.id, artist.name
            
            
            LIMIT 5;
        `
    }

    return results
}

module.exports = { liveSearch }