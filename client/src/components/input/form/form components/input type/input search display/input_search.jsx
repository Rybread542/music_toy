import { forwardRef, useEffect, useState, useRef } from "react";
import { Live_Search_Results } from "./live_search_results";
import { liveSearchCall } from "../../../../../../util/liveSearch";
import { Input_Search_Confirm_Button } from "./input_search_confirm_button";
import { AnimatePresence, easeIn, motion } from "motion/react";
import { Load_Spinner } from "../../../../../misc/load_spinner";


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
    const [ searchLoad, setSearchLoad ] = useState(false)

    const [ searchResults, setSearchResults ] = useState([])

    const [ selectedIdx, setSelectedIdx ] = useState(0)

    const [height, setHeight] = useState(0)

    const searchContainerRef = useRef(null)
    const windowRef = useRef(null)

    //debounce query logic
    useEffect(() => {
        const timer = setTimeout(() => {
            setSearchLoad(true)
            setDebounceQuery(searchQuery)
        }, 200)

        return () => clearTimeout(timer)
    }, [searchQuery])

    useEffect(() => {
        setSearchLoad(true)
        if (debounceQuery.length < 3) {
            setSearchResults([])
            setSearchLoad(false)
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
            
            finally {
                setSearchLoad(false)
            }
        }
        
        search();
        return () => {
            abort.abort();
            setSearchLoad(false)
        }

    }, [debounceQuery])

    const handleSearchUpdate = (e) => {
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
                    setSearchLoad(false)
                    setSearchQuery('')
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

        useEffect(() => {
            const handleClick = (e) => {
                setSearchQuery('')
            }
    
            document.addEventListener('click', handleClick)
    
            return () => {
                document.removeEventListener('click', handleClick)
            }
        }, [windowRef])



        useEffect(() => {
            if (searchContainerRef.current) {
                const children = searchContainerRef.current.querySelectorAll('div')
                if (children) {
                    const newHeight =[...children].reduce((accum, item) => accum + item.offsetHeight, 0)
                    setHeight(newHeight)
                }
                
            }
        }, [searchResults])


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

            <AnimatePresence>
                
                {(searchQuery.length >= 3) &&
                (
                <motion.div className="live-search-container"
                ref={windowRef}
                key={inputType}
                initial={{height: 0}}
                animate={{width: '100%', height: Math.min(height, 200)}}
                transition={{duration: '0.3', ease: 'easeInOut'}}
                exit={{height: 0}}
                layout>
                    {searchLoad ?
                    <Load_Spinner width={'30px'} height={'30px'} opacity={'0.5'}/>
                    :
                    <Live_Search_Results 
                    searchResults={searchResults} 
                    searchType={inputType} 
                    handleSearchInputChange={handleInputSearchChange}
                    setSearchResults={setSearchResults}
                    setSearchQuery={setSearchQuery}
                    selectedIdx={selectedIdx}
                    ref={searchContainerRef}
                    />}
                </motion.div>
                )}
                
            </AnimatePresence>
                
            </div>

            
        </>
    )
})
