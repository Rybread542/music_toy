/**
 * @module musicLinks
 * @description helper methods for returning streaming links and 
 * art/photos from various music APIs
 */



import { spotifyClientID, spotifyClientSecret, youtubeAPIKey } from '../misc_utils/dotenv.mjs';
import { CoverArtArchiveApi } from 'musicbrainz-api'

//////////// Spotify

// client keys

/**
 * Create a Spotify API access token 
 * With Client Credential flow
 * @returns {string} API token
 */
export async function spotifyGetAccessToken() {
    console.log('generating token')
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
    console.log(tokenJSON)
    return tokenJSON.access_token
}

// Quick boilerplate fetch parameters
export function getSpotifySearchParams(token) {
    return {
        method: 'GET',
        headers: {
            'Content-Type' : 'application/json',
            'Authorization' : `Bearer ${token}`
        }
    }
}

/**
 * Fetch a Spotify link and potentially artist photo link
 * @param {string} type 
 * @param {string} artist 
 * @param {string} title 
 * @param {string} token 
 * @returns {Object} spotify link, artist photo link
 */
async function getSpotifyLink(type, artist, title, token) { 
    try {
        // Strip specials and spaces. Spotify API gets mad at them sometimes
        artist = artist.replace(/[^a-zA-Z0-9 ]/g, '').toLowerCase()
        if (title) {
            title = title.replace(/[^a-zA-Z0-9 ]/g, '').toLowerCase()
        }

        let artistPhoto = null

        // Build query based on inputs. If searching an artist, we don't need a title
        const q = (type === 'artist' ? 
        `${artist}`
        :
        `artist:${artist} ${type}:${title}`)
        + `&type=${type}&limit=1`
        
        // init fetch params according to docs
        let params = getSpotifySearchParams(token)

        const searchData = await fetch(`https://api.spotify.com/v1/search?q=${q}`, params)

        const data = await searchData.json()


        // we will simply return the entire object to deal with elsewhere in case of error
        // usually this will be a 401 bad token since tokens last 1hr
        if (data.error) {
            return {spotLink: data, artistPhoto : 'artist-photo-default_ezocsj'}
        }


        // we leverage Spotify's helpful artist photos to display on the front end
        if (type === 'artist') {
            artistPhoto = data.artists.items[0].images[0].url
        }

        // returns raw url and artist photo
        const spotLink = data[type+'s'].items[0].external_urls.spotify
        return {spotLink, artistPhoto}
    }

    catch (e) {
        console.log(`error searching spot link: ` + e)
        console.log(`Couldn\'t find a spotify link for ${title}` )

        // if we get an empty result, we can return a default artist placeholder photo
        return {spotLink: null, artistPhoto: 'artist-photo-default_ezocsj'}
    }

}


///////////////////// Youtube

/**
 * Fetch a YouTube link
 * @param {string} type 
 * @param {string} artist 
 * @param {string} title 
 * @returns {string} YouTube link or null if none found/rate limit
 */
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
        return link
    }

    console.log(`no youtube link found for ${title}`)
    return null
}


/**
 * Fetch an album art image link from MusicBrainz cover art archive
 * @param {string} mbid global ID of album
 * @returns {string} album art link
 */
export async function getAlbumArt(mbid) {

    try { 
        const covertArtApi = new CoverArtArchiveApi()

        const coverData = await covertArtApi.getReleaseGroupCovers(mbid)
        return coverData.images[0].thumbnails['large']
    }

    catch(e) {
        console.log('error grabbing cover art', e)
        return 'album-art-default_rjd8q2'
    }
}







export async function findLinks(musicObj, spotAuthToken) {

    let {outputType, outputArtist, outputTitle, outputMBID} = musicObj
    let {spotLink, artistPhoto} = await getSpotifyLink(outputType, outputArtist, outputTitle, spotAuthToken)
    if (spotLink && spotLink.error) {
                if (spotLink.error.status === 401) {
                    newToken = await spotifyGetAccessToken()
                    ({spotLink, artistPhoto} = await getSpotifyLink(outputType, outputArtist, outputTitle, newToken))
                }

                else {
                    console.log(`Error fetching Spotify link. Status ${spotLink.error.status}: ${spotLink.error.message}`)
                }
            }


    let ytLink = await getYoutubeLink(outputType, outputArtist, outputTitle)

    let albumArtLink = null
    if (outputType != 'artist'){
        albumArtLink = await getAlbumArt(outputMBID)
    }
    

    return {...musicObj,
        spotifyLink : spotLink,
        youtubeLink : ytLink,
        albumArt: albumArtLink,
        artistPhoto: artistPhoto
    }
}

