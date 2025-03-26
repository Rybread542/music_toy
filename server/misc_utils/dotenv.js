require('dotenv').config({path : "../.env"})

const spotifyClientID = process.env.SPOTIFY_API_CLIENT_ID
const spotifyClientSecret = process.env.SPOTIFY_API_SECRET
const youtubeAPIKey = process.env.YOUTUBE_API_KEY

module.exports = {spotifyClientID, spotifyClientSecret, youtubeAPIKey}