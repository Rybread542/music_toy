const OpenAI = require('openai')

const grokClient = new OpenAI({
    apiKey : process.env.GROK_AI_KEY,
    baseURL : "https://api.x.ai/v1"
})

async function getMusicRecs(input) {
    console.log('input: ', input)
    const output = await grokClient.chat.completions.create({
        model: 'grok-2-latest',
        messages: [
            {
                role: 'system',
                content: process.env.AI_RECOMMEND_PROMPT,
            },
            {
                role: 'user',
                content: JSON.stringify(input)
            }
        ]
    })

    const message = output.choices[0].message.content
    console.log('message: ', message)
    const outputData = JSON.parse(message)
    const outputDataArray = Object.values(outputData)
    console.log('output: ', outputDataArray)
    return outputDataArray
}

module.exports = {getMusicRecs}