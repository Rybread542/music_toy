const express = require('express')
const cors = require('cors')
require('dotenv').config()
const { getRecommendations } = require('./processRecData')
const { spotifyGetAccessToken, getSpotifyLink, getYoutubeLink } = require('./music_links')


const app = express()
const PORT = process.env.LISTEN_PORT

let spotifyAuthToken
(async()=> {
    spotifyAuthToken = await spotifyGetAccessToken()
    console.log(`token: ${spotifyAuthToken}`)
})()


app.use(express.json())


app.get('/', (req, res) => {

    console.log('test')

})

app.post('/api/ai', async (req, res) => {
    console.log('request body: ', req.body)

    let musicRecData = await getRecommendations(req.body.inputData, spotifyAuthToken)
    res.json(musicRecData)

})

app.listen(PORT, () => {
    console.log(`Running on port ${PORT}`)
})