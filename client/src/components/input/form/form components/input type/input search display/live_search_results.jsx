import { useEffect, useRef } from "react"


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
        <div className="live-search-results"
        ref={windowRef}>
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
        </div>
    )

}