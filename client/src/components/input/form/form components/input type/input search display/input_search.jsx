import { forwardRef, useEffect, useState } from "react";
import { Live_Search_Results } from "./live_search_results";
import { liveSearchCall } from "../../../../../../util/liveSearch";
import { Input_Search_Confirm_Button } from "./input_search_confirm_button";


export const Input_Search = forwardRef(({
    inputType, 
    inputArtist, 
    inputTitle, 
    handleInputSearchChange,
    handleConfirmClick,
    enabled
    }, ref) => {

    const [ searchQuery, setSearchQuery ] = useState('')
    const [ debounceQuery, setDebounceQuery ] = useState('')

    const [ searchResults, setSearchResults ] = useState([])

    const [ selectedIdx, setSelectedIdx ] = useState(0)

    //debounce query logic
    useEffect(() => {
        const timer = setTimeout(() => {
            setDebounceQuery(searchQuery)
        }, 300)

        return () => clearTimeout(timer)
    }, [searchQuery])

    useEffect(() => {
        if (debounceQuery.length < 3) {
            return
        }

        const abort = new AbortController();
            
        async function search() {

            try {   
                const data = await liveSearchCall(inputType, inputArtist, debounceQuery, abort.signal);
                setSearchResults(data);
            }

            catch (e) {
                if (e.name === 'AbortError') {
                    return
                }
    
                else {
                    console.log('error fetching: ', e)
                }
            }     
        }
        
        search();

        return () => {
            abort.abort();
        }

    }, [debounceQuery])

    const handleSearchUpdate = (e) => {
        setSearchResults([])
        setSearchQuery(e.target.value)
        handleInputSearchChange(e.target.value, inputType)
    }

    const confirmButtonVisible = () => {
        return inputType === 'artist' ? 
        (inputArtist.length > 0)
        :
        (inputTitle.length > 0)
    }



    // live result keyboard nav
    const handleResultSelect = (e) => {
            if (e.key === 'Enter') {
                if(searchResults.length > 0) {
                    e.preventDefault()
                    setSearchResults([])
                    setSelectedIdx(0)
                    handleInputSearchChange(inputType === 'artist' ? 
                    searchResults[selectedIdx].name
                    :
                    searchResults[selectedIdx].title, inputType)
                }
                
                else {
                    handleConfirmClick()
                }
            }

            if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
                e.preventDefault();
            }
    
            if(e.key === 'ArrowDown') {
                if (selectedIdx == (searchResults.length - 1)) {
                    setSelectedIdx(0)
                }
    
                else {
                    setSelectedIdx(selectedIdx+1)
                }
            }
    
            if(e.key === 'ArrowUp') {
                if(selectedIdx != 0) {
                    setSelectedIdx(selectedIdx-1)
                }
            }
        }


    return (
        <>
            <div className="input-search-container">
            
                <input
                type="text"
                className="form-text-input"
                placeholder={inputType === 'artist' ? 'Artist' : 'Title'}
                value={inputType === 'artist' ? inputArtist : inputTitle ?? ''}
                onChange={(e) => {handleSearchUpdate(e)}}
                onFocus={() => setSearchResults([])}
                disabled={!enabled}
                ref={ref}
                onKeyDown={handleResultSelect}
                />
                
                    
                {(enabled && confirmButtonVisible()) &&
                    <div className="input-search-confirm-container">
                        <Input_Search_Confirm_Button handleConfirmClick={handleConfirmClick}/>
                    </div>
                }

            {(searchResults.length > 0 && enabled) &&
            (<Live_Search_Results 
            searchResults={searchResults} 
            searchType={inputType} 
            handleSearchInputChange={handleInputSearchChange}
            setSearchResults={setSearchResults}
            selectedIdx={selectedIdx}
            />)}
                
            </div>

            
        </>
    )
})
