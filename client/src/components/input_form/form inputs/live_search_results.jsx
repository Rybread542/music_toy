

export function Live_Search_Results({
    searchResults, 
    searchType,
    inputArtist, 
    setInputArtist, 
    setInputTitle,
    setSearchResults
}) {

    const handleResultClick = (item) => {
            setSearchResults([])
            if (searchType === 'artist') {
                setInputArtist(item.name)
            }
            
            else {
                setInputArtist(item.name)
                setInputTitle(item.title)
            }
    }


    return (
        <div className="live-search-results">
            {searchResults.map((item, index) => {
                return (
                <div className="search-result-container" key={index}>
                    <p className="search-result" 
                    onClick={(e) =>{ 
                        e.stopPropagation()
                        handleResultClick(item)}
                    }
                    >
                    {searchType === 'artist' ? item.name : item.title}
                    </p>
                </div>)
            })}
        </div>


    )
}