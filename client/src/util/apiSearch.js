

export async function liveSearchCall(type, artist, query, signal) {
    let q = normalizeString(query)
    let normArtist = normalizeString(artist)
    console.log('searching' + q)
    const response = await fetch('/api/search', {
        method: 'POST',
        headers : { 'Content-Type' : 'application/json' },
        body: JSON.stringify({
            type: type,
            artist: normArtist,
            query: q}),
        signal : signal,
    })

    const data = await response.json()
    return data
}

export async function displaySearchCall(searchQuery) {
    const response = await fetch('/api/inputdisplay', {
        method : 'POST',
        headers : { 'Content-Type' : 'application/json' },
        body : JSON.stringify({ 
            searchQuery
         })
    })

    const data = await response.json()
    return data
}

export async function recommendSearchCall(inputData) {
    const response = await fetch('/api/ai', {
        method : 'POST',
        headers : { 'Content-Type' : 'application/json' },
        body : JSON.stringify({ 
            inputData
         })
    })

    const result = await response.json()
    return result
}

function normalizeString(str) {
    return str
    .trim()
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-zA-Z0-9]/g, '')
}