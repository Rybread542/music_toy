require('dotenv').config()


// Spotify

const spotifyClientID = process.env.SPOTIFY_API_CLIENT_ID
const spotifyClientSecret = process.env.SPOTIFY_API_SECRET

async function spotifyGetAccessToken() {
    const tokenFetch = await fetch('https://accounts.spotify.com/api/token', {
        method : 'POST', 
        headers : {
            'Content-Type' : 'application/x-www-form-urlencoded',
        },

        body : new URLSearchParams( {
            grant_type: 'client_credentials',
            client_id: spotifyClientID,
            client_secret: spotifyClientSecret,
        }),
    })

    const tokenJSON = await tokenFetch.json()
    return tokenJSON.access_token
}

async function getSpotifyLink(type, artist, title, token) { 
    artist = artist.replace(/[^a-zA-Z0-9 ]/g, '').toLowerCase()
    title = title.replace(/[^a-zA-Z0-9 ]/g, '').toLowerCase()

    if (type === 'song') {
        type = 'track'
    }

    const q = (type === 'artist' ? 
    `artist:${artist}`
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

    const searchData = await fetch(`https://api.spotify.com/v1/search?q=${q}`, params)

    const data = await searchData.json()

    console.log(`data for ${title}: `, data)

    if (data.error) {
        return data
    }

    switch(type) {

        case 'track':
            return data.tracks.items[0].external_urls.spotify

        case 'album':
            return data.albums.items[0].external_urls.spotify
        
        case 'artist':
            return data.artists.items[0].external_urls.spotify
    }

}

module.exports = {spotifyGetAccessToken, getSpotifyLink}