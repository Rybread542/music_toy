import { forwardRef, useEffect, useRef } from "react"


export const Live_Search_Results = forwardRef(({
    searchResults,
    setSearchResults,
    setSearchQuery,
    searchType,
    handleSearchInputChange,
    selectedIdx,
}, ref) => {

    
    
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
        setSearchQuery('')
        handleSearchInputChange(searchType === 'artist' ? item.name : item.title, searchType)
    }
    
    
    



    return (
            <div className="live-search-results"
            ref={ref}>
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

})