import debounce from 'lodash.debounce'
import { useState, useMemo, useRef, useEffect } from 'react'
import { Live_Search_Results } from './live_search_results'


export function Live_Search_Input({
    inputType, 
    inputArtist, 
    setInputArtist, 
    inputTitle, 
    setInputTitle, 
    searchResults, 
    setSearchResults
}) {

        const [searchQuery, setSearchQuery] = useState('')
        const [ debounceQuery, setDebounceQuery ] = useState('')

        const wrapRef = useRef(null)
        const [showResults, setShowResults] = useState(false)

        useEffect(() => {
            const timer = setTimeout(() => {
                setDebounceQuery(searchQuery)
            }, 300)

            return () => clearTimeout(timer)
        }, [searchQuery])


        useEffect(() => {
            if (debounceQuery.length <= 3) {
                setSearchResults([])
                return
            }

            const abort = new AbortController();

            (async () => {
                try {
                    const q = debounceQuery
                    .trim()
                    .toLowerCase()
                    .normalize("NFD")
                    .replace(/[\u0300-\u036f]/g, "")
                    .replace(/[^a-zA-Z0-9]/g, '')

                    console.log(`QUERY artist: ${inputArtist} title ${inputTitle}`)
                    console.log(`Q: ${q}`)
    
                    const searchResponse = await fetch('/api/search', {
                        method: 'POST',
                        headers : { 'Content-Type' : 'application/json' },
                        body: JSON.stringify({
                            type: inputType,
                            artist: inputArtist,
                            query: q}),
                        signal : abort.signal,
                    })
    
                    const responseData = await searchResponse.json()
                    
                    setSearchResults(responseData)
                    console.log(responseData)
                }
    
                catch (error) {
                    if(error.name === 'AbortError') {
                        console.log('abort')
                    }
                    else {
                        console.log('error fetching: ', error)
                    }
                }
            })()

            return () => {
                abort.abort()
            }


        }, [debounceQuery])

        

        const handleInputChange = (e) => {
            let val = e.target.value

            inputType === 'artist' ? 
            setInputArtist(val)
            :
            setInputTitle(val)

            setSearchQuery(val)
            
        }

        useEffect(() => {
            function handleOutsideClick(e) {
                if (wrapRef.current && !wrapRef.current.contains(e.target)) {
                    setShowResults(false)
                }
            }

            document.addEventListener('mousedown', handleOutsideClick)

            return () => {
                document.removeEventListener('mousedown', handleOutsideClick)
            }
        }), []


        return (
            <>
                <div ref={wrapRef} className="live-search-input-container">
                    <input type="text"
                    id={inputType === 'artist' ? 'Artist' : 'Title'}
                    value={inputType === 'artist' ? inputArtist : inputTitle ?? ''}
                    placeholder={inputType === 'artist' ? 'Artist' : 'Title'}
                    onChange={handleInputChange}
                    onFocus={() => {setShowResults(true)}}
                     />
                    {(searchResults.length > 0 && showResults) && (
                        <Live_Search_Results 
                        searchResults={searchResults} 
                        searchType={inputType}
                        setSearchResults={setSearchResults}
                        inputArtist={inputArtist}
                        setInputArtist={setInputArtist}
                        setInputTitle={setInputTitle}/>
                    )}
                </div>
            </>
        )
}