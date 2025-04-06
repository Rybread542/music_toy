import { spotifyGetAccessToken, getSpotifySearchParams } from '../algo_utils/music_links.mjs'

export async function getSpotifyData(type, artist, title, token) {
    try {
        
        artist = normalizeString(artist)

        if(title) {
            title = normalizeString(title)
        }

        console.log(`artist: ` + artist)
        console.log(`title: ` + title)
        console.log(`type: ${type}`)

        const q = (type === 'artist' ? 
        `${artist}`
        :
        `artist:${artist} ${type}:${title}`)
        + `&type=${type}&limit=1`

        let params = getSpotifySearchParams(token)

        let searchData = await fetch(`https://api.spotify.com/v1/search?q=${q}`, params)

        let data = await searchData.json()
        if (data.error) {
            if (data.error.status = 401){
                token = await spotifyGetAccessToken()
                params = getSpotifySearchParams(token)
                searchData = await fetch(`https://api.spotify.com/v1/search?q=${q}`, params)
                data = await searchData.json()
            }

            else {
                console.log(`spotify search error in display data search: ${data.error.status} ${data.error.message}`)
                return null
            }
        }
        console.log(data)
        const resultArtist = type != 'artist' ? 
        data[type+'s'].items[0].artists[0].name
        :
        data.artists.items[0].name

        const resultTitle = type != 'artist' ? data[type+'s'].items[0].name : ''
        let resultImg = ''
        let resultYear = ''
        let resultGenres = ''

        if (type === 'track') {
            resultImg = data.tracks.items[0].album.images[0].url
            resultYear = data.tracks.items[0].album.release_date.slice(0,4)
        }
        
        else if (type === 'album') {
            resultImg = data.albums.items[0].images[0].url
            resultYear = data.albums.items[0].release_date.slice(0,4)
        }

        else {
            resultImg = data.artists.items[0].images[0].url
            resultGenres = data.artists.items[0].genres
        }
        
        return {
            resultArtist,
            resultTitle,
            resultImg,
            resultYear,
            resultGenres
        }

    }

    catch (e) {
        console.log(`error searching for ${type} data: ${e}: ${e.stack}`)
        console.log(`No spotify display data available` )
        return {
            resultArtist : null,
            resultTitle : null,
            resultImg : null,
            resultYear : null,
            resultGenres : null
            }
    }

}

function normalizeString(string) {
    return string
    .toLowerCase()
    .normalize('NFD')                     
    .replace(/[\u0300-\u036f]/g, '')      
    .replace(/[^a-z0-9\s]/g, '')         
    .replace(/\s+/g, ' ')                  
    .trim()
}



