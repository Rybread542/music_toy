const { spotifyClientID, spotifyClientSecret, youtubeAPIKey } = require('../misc_utils/dotenv')

//////////// Spotify

// client keys

// Create access token using Client Credentials flow
// Simple fetch and return. Spotify docs are extremely vague about this setup
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

// Turn a title/artist query into a Spotify link
async function getSpotifyLink(type, artist, title, token) { 
    try {
        // Strip specials and spaces. Spotify API gets mad at them sometimes
        artist = artist.replace(/[^a-zA-Z0-9 ]/g, '').toLowerCase()
        if (title) {
            title = title.replace(/[^a-zA-Z0-9 ]/g, '').toLowerCase()
        }

        

        // Change 'song' to spotify-friendly 'track'
        if (type === 'song') {
            type = 'track'
        }

        // Build query based on inputs. If searching an artist, we don't need a title
        const q = (type === 'artist' ? 
        `${artist}`
        :
        `artist:${artist} ${type}:${title}`)

        // add URL params
        + `&type=${type}&limit=1`
        
        // init fetch params according to docs
        const params = {
            method: 'GET',
            headers: {
                'Content-Type' : 'application/json',
                'Authorization' : `Bearer ${token}`
            }
        }

        const searchData = await fetch(`https://api.spotify.com/v1/search?q=${q}`, params)

        const data = await searchData.json()

        // we will simply return the entire object to deal with elsewhere in case of error
        // usually this will be a 401 bad token since tokens last 1hr
        if (data.error) {
            return data
        }
        // returns raw url
        return data[type+'s'].items[0].external_urls.spotify
    }

    catch (e) {
        console.log(`error searching spot link: ` + e)
        console.log(`Couldn\'t find a spotify link for ${title}` )
        return null
    }
    
    


}


// Youtube

async function getYoutubeLink(type, artist, title) {
    // youtube links are simpler to get, but much less accurate
    // best we can do is a raw search query
    
    const q = type != 'artist' ? `${artist} ${title} ${type === 'album' ? `full album`:``}`:`${artist} music video`

    console.log(`query: ${q}`)

    const url = `https://www.googleapis.com/youtube/v3/search?part=snippet&q=${encodeURIComponent(q)}&type=video&maxResults=1&key=${youtubeAPIKey}`

    const response = await fetch(url, {
        method : 'GET',
        headers : {'Content-Type' : 'application/json'}
    })

    const data = await response.json()
    console.log(data)

    if (data.items && data.items.length > 0) {
        const id = data.items[0].id.videoId

        const link = `https://www.youtube.com/watch?v=${id}`

        console.log(`youtube link: ${link}`)
        return link
    }

    console.log(`no youtube link found for ${title}`)
    return null
}


async function findLinks(musicObj, spotAuthToken) {

    let {outputType, outputArtist, outputTitle} = musicObj
    let spotLink = await getSpotifyLink(outputType, outputArtist, outputTitle, spotAuthToken)

    if (spotLink && spotLink.error) {
                if (spotLink.error.status === 401) {
                    spotAuthToken = await spotifyGetAccessToken()
                    spotLink = await getSpotifyLink(outputType, outputArtist, outputTitle, spotAuthToken)
                }

                else {
                    console.log(`Error fetching Spotify link. Status ${spotLink.error.status}: ${spotLink.error.message}`)
                }
            }


    let ytLink = await getYoutubeLink(outputType, outputArtist, outputTitle)

    return {...musicObj,
        spotifyLink : spotLink,
        youtubeLink : ytLink
    }
}

module.exports = {spotifyGetAccessToken, findLinks}