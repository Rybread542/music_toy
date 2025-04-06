

export async function liveSearchCall(type, artist, query, signal) {
    let q = normalizeString(query)
    console.log('searching' + q)
    const response = await fetch('/api/search', {
        method: 'POST',
        headers : { 'Content-Type' : 'application/json' },
        body: JSON.stringify({
            type: type,
            artist: artist,
            query: q}),
        signal : signal,
    })

    const data = await response.json()
    return data
}

export async function displaySearchCall(searchQuery) {
    const response = await fetch('/api/spotsearch', {
        method : 'POST',
        headers : { 'Content-Type' : 'application/json' },
        body : JSON.stringify({ 
            searchQuery
         })
    })

    const data = await response.json()
    return data
}

function normalizeString(str) {
    return str
    .trim()
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-zA-Z0-9]/g, '')
}