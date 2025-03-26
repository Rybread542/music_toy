const express = require('express')
const cors = require('cors')
require('dotenv').config()
const { getRecommendations } = require('./algo_utils/processRecData')
const { spotifyGetAccessToken } = require('./algo_utils/music_links')
const { liveSearch } = require('./misc_utils/liveSearch')
const { getSpotifyData } = require('./misc_utils/inputSearch')


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
    console.log(`musicRecData: ${musicRecData}`)
    res.json(musicRecData)

})

app.post('/api/search', async (req, res) => {
    const {type, artist, query} = req.body
    let searchResults = await liveSearch(type, artist, query)
    console.log(searchResults)
    res.json(searchResults)
})

app.post('/api/spotsearch'), async (req, res) => {
    const {type, artist, title} = req.body

    const spotData = await getSpotifyData(type, artist, title, spotifyAuthToken)
    console.log(spotData)
    res.json(spotData)
}

app.listen(PORT, () => {
    console.log(`Running on port ${PORT}`)
})