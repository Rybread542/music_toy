/** 
* @module processRecData
* @description Aggregates recommendations and links into a single object to be sent back to server.js
*
*/

const { spawn } = require('child_process')
const { findLinks } = require('./music_links')









/**
 * @param {Object} inputData
 * 
 * @returns {Object} JSON 
*/
async function getRecommendations(inputData, spotifyAuthToken) {
    let pyFormattedData = JSON.stringify({
        input_type : inputData.inputType,
        output_type : inputData.outputType,
        input_artist : inputData.inputArtist,
        input_title : inputData.inputTitle,
        input_comment : inputData.inputComment
    })

    console.log(pyFormattedData)

    const pythonReccAlgo = spawn('./bin/python', ['rec_algo.py', pyFormattedData])

    return new Promise((resolve) => {
        let pythonData = ''
        let reccData
        pythonReccAlgo.stdout.on('data', (data) => {
            pythonData += data.toString()
        })

        pythonReccAlgo.stderr.on('data', (data) => {
            console.error(`Python error: ${data}`)
        })

        pythonReccAlgo.on('close', async (code) => {
            console.log(`python exited with code: ${code}`)
            reccData = JSON.parse(pythonData)

            console.log(reccData)
            reccData = reccData.map(async (item) => {
                return await findLinks(item, spotifyAuthToken)
            })
            reccData = await Promise.all(reccData)
            resolve(reccData)
        })
    })
}

// getRecommendations({
//     inputType : 'artist',
//     outputType : 'album',
//     inputTitle : '',
//     inputArtist : 'Car Seat Headrest',
//     inputComment : ''
//     })

module.exports = { getRecommendations }