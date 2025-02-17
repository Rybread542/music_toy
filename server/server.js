const express = require('express')
const cors = require('cors')
require('dotenv').config()

const app = express()
const PORT = process.env.LISTEN_PORT

app.use(express.json())


app.get('/', (req, res) => {

    console.log('test')

})

app.post('/api/ai', async (req, res) => {
    console.log('got the request')
    res.json({message:
        'got it boss'
    })

})

app.listen(PORT, () => {
    console.log(`Running on port ${PORT}`)
})