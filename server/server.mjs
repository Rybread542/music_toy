import express, { json } from 'express'
import cors from 'cors'
import { configDotenv } from 'dotenv'
import { getRecommendations } from './algo_utils/processRecData.mjs'
import { spotifyGetAccessToken } from './algo_utils/musicLinks.mjs'
import { inputDisplaySearch, liveSearch } from './misc_utils/clientSearchTools.mjs'


const app = express()
const PORT = process.env.LISTEN_PORT

let spotifyAuthToken
(async()=> {
    spotifyAuthToken = await spotifyGetAccessToken()
    console.log(`token: ${spotifyAuthToken}`)
})()

setInterval(async () => {
    spotifyAuthToken = await spotifyGetAccessToken()
    console.log(`token refreshed: ${spotifyAuthToken}`)
}, 3555555)


app.use(json())


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

app.post('/api/inputdisplay', async (req, res) => {
    const {inputType, inputArtist, inputTitle} = req.body.searchQuery
    console.log(inputType, inputArtist, inputTitle)
    const displayData = await inputDisplaySearch(inputType, inputArtist, inputTitle, spotifyAuthToken)
    console.log(displayData)
    res.json(displayData)
})

app.listen(PORT, () => {
    console.log(`Running on port ${PORT}`)
})