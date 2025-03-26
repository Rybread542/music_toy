require('../misc_utils/dotenv')
const { spotifyGetAccessToken } = require('../algo_utils/music_links')

async function getSpotifyData(type, artist, title, token) {
    try {
        artist = artist.replace(/[^a-zA-Z0-9 ]/g, '').toLowerCase()
        if (title) {
            title = title.replace(/[^a-zA-Z0-9 ]/g, '').toLowerCase()
        }

        const q = (type === 'artist' ? 
        `${artist}`
        :
        `artist:${artist} ${type}:${title}`)
        + `&type=${type}&limit=1`
        
        
        const params = {
            method: 'GET',
            headers: {
                'Content-Type' : 'application/json',
                'Authorization' : `Bearer ${token}`
            }
        }

        let searchData = await fetch(`https://api.spotify.com/v1/search?q=${q}`, params)

        let data = await searchData.json()
        console.log(data)
        if (data.error) {
            if (data.error.status === 401){
                token = await spotifyGetAccessToken()
                searchData = await fetch(`https://api.spotify.com/v1/search?q=${q}`, params)
                data = await searchData.json()
            }

            else {
                console.log(`spotify search error in display data search: ${data.error.status} ${data.error.message}`)
                return null
            }
        }

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
        
        if (type === 'album') {
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
        console.log(`error searching for ${type} data: ` + e)
        console.log(`No spotify display data available` )
        return null
    }

}

module.exports = { getSpotifyData }



