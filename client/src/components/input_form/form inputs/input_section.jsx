import { Live_Search_Input } from "./live_search_input"
import { Input_Search_Display } from "./input_search_display"

export function Input_Section ({
    inputArtist, 
    setInputArtist, 
    inputTitle, 
    setInputTitle,
    inputType,
    inputFinished}) {




    const [titleSearchResults, setTitleSearchResults] = useState([])
    const [artistSearchResults, setArtistSearchResults] = useState([])
    
    const [ displayData, setDisplayData ] = useState(null)
    const [ loading, setLoading ] = useState(false)
    const [ confirmed, setConfirmed ] = useState(false) 

    const handleConfirmClick = () => {
        setLoading(true)
        setConfirmed(true)
        handleSearch()
    }


    const handleSearch = async () => {
        const searchQuery = {inputType, inputArtist, inputTitle}
        const response = await fetch('/api/spotsearch', {
            method : 'POST',
            headers : { 'Content-Type' : 'application/json' },
            body : JSON.stringify({ 
                searchQuery
             })
        })

        const result = await response.json()
        setDisplayData(result)
        setLoading(false)
    }



    return (

        <>
            <div className="input-form-type-details">
            
                {!inputFinished && 
                <Live_Search_Input inputType={'artist'} 
                inputArtist={inputArtist}
                inputTitle={inputTitle} 
                setInputArtist={setInputArtist} 
                setInputTitle={setInputTitle}
                searchResults={artistSearchResults}
                setSearchResults={setArtistSearchResults} />}

                {(inputType != 'artist' && !inputFinished) &&
                <Live_Search_Input 
                inputType={inputType} 
                inputArtist={inputArtist}
                inputTitle={inputTitle} 
                setInputArtist={setInputArtist} 
                setInputTitle={setInputTitle}
                searchResults={titleSearchResults}
                setSearchResults={setTitleSearchResults} />}
            
            </div>
            <div className="input-form-search-confirm-button" onClick={handleConfirmClick}>
                <p>Check</p>
            </div>

            {confirmed && 
            (<Input_Search_Display 
            type={inputType}
            artist={inputArtist}
            title={inputTitle}
            loading={loading}/>)}
        </>
    )
}