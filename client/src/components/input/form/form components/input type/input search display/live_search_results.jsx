import { useEffect, useRef } from "react"
import { motion, AnimatePresence } from "motion/react"


export function Live_Search_Results({
    searchResults,
    setSearchResults,
    searchType,
    handleSearchInputChange,
    selectedIdx,
}) {


    const windowRef = useRef(null)
    const posRef = useRef([])

    useEffect(() => {
        posRef.current = []
    }, [searchResults])

    useEffect(() => {
        const pos = posRef.current[selectedIdx]
        if (pos) {
            pos.scrollIntoView({block : 'nearest'})
        }
    }, [selectedIdx])


    const handleResultClick = (item) => {
        setSearchResults([])
        handleSearchInputChange(searchType === 'artist' ? item.name : item.title, searchType)
    }
    
    useEffect(() => {
        const handleClick = (e) => {
            setSearchResults([])
        }

        document.addEventListener('click', handleClick)

        return () => {
            document.removeEventListener('click', handleClick)
        }
    }, [windowRef])


    return (
            <motion.div className="live-search-results"
            ref={windowRef}
            key={searchType}
            style={{overflow: 'hidden'}}
            initial={{height: 0, width: '100%'}}
            animate={{height: '7rem'}}
            exit={{height: 0}}
            layout>
                {searchResults.map((item, index) => {
                    return (
                    <div className={"search-result-container" 
                    + (selectedIdx == index ? ' search-result-container-selected' : '' )} key={index}>
                        <p className="search-result" 
                        onClick={(e) =>{ 
                            e.stopPropagation()
                            handleResultClick(item)
                            }
                        }
                        ref={(node) => {posRef.current[index] = node}}
                        >
                        {searchType === 'artist' ? item.name : item.title}
                        </p>
                    </div>)
                })}
            </motion.div>
    )

}