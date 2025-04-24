/** 
* @module processRecData
* @description Aggregates recommendations and links into a single object to be sent back to server.js
*
*/

import { spawn } from 'child_process'
import { findLinks } from './musicLinks.mjs'
import { normalizeString } from '../misc_utils/clientSearchTools.mjs'


/**
 * Central recommendation aggregation loop
 * @param {Object} inputData
 * 
 * @returns {Object} JSON 
*/
export async function getRecommendations(inputData, spotifyAuthToken) {
    // Format user input to be python friendly
    let pyFormattedData = JSON.stringify({
        input_type : inputData.inputType,
        output_type : inputData.outputType,
        input_artist : normalizeString(inputData.inputArtist),
        input_title : inputData.inputTitle ? normalizeString(inputData.inputTitle): inputData.inputTitle,
        input_date_range : inputData.dateRange,
        input_pop_val : inputData.popVal,
        input_comment : inputData.inputComment
    })

    console.log(pyFormattedData)


    // Subprocess for all the main querying/vector creation, etc
    const pythonReccAlgo = spawn('bin/python', ['./algo_utils/rec_algo.py', pyFormattedData])
    

    // TODO: needs refining. Python errors can still cause infinite loading on client
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
            if ('error' in reccData) {
                console.log('error')
                resolve(reccData)
                return
            }

            
            reccData = reccData.map(async (item) => {
                return await findLinks(item, spotifyAuthToken)
            })
            reccData = await Promise.all(reccData)
            console.log('reccdata:', reccData)
            resolve(reccData)
        })
    })
}