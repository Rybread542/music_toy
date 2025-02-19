const express = require('express')
const cors = require('cors')
require('dotenv').config()
const {getMusicRecs} = require('./AI_talk')

const app = express()
const PORT = process.env.LISTEN_PORT

app.use(express.json())


app.get('/', (req, res) => {

    console.log('test')

})

app.post('/api/ai', async (req, res) => {
    console.log('request body: ', req.body)
    const testData = {
        data : [
            {
                type : 'album',
                title : 'test title 1',
                artist : 'test artist 1',
                year : 'test year 1'
            },
            {
                type : 'album',
                title : 'test title 2',
                artist : 'test artist 2',
                year : 'test year 2'
            },
            {
                type : 'album',
                title : 'test title 3',
                artist : 'test artist 3',
                year : 'test year 3'
            },
        ]
    }
    const musicRecData = await getMusicRecs(req.body.formInputs)
    res.json(musicRecData)


})

app.listen(PORT, () => {
    console.log(`Running on port ${PORT}`)
})