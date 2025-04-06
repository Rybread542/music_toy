import { Marquee_Text } from "../../../../../misc/marquee_text"


export function Input_Search_Display({displayData, loading, type}) {

    if(loading) {
        return ( 
        <div className="input-search-delay">
            <p>loading...</p>
        </div>
        )
    }

    return (

        <div className="input-search-display">
            <div className="search-display-img">
                <img src={displayData.resultImg ? displayData.resultImg : 'album-art-default.png'} alt="" />
            </div>

            <div className="search-display-info">

                {type != 'artist' && 
                    (<>
                        {
                            displayData.resultTitle.length > 20 ?
                            (<Marquee_Text
                            text={displayData.resultTitle}
                            bold={true}
                            id={'search-display-title'}/>)
                            :
                            <p id="search-display-title">{displayData.resultTitle}</p>
                        }

                        <p id="search-display-artist">{displayData.resultArtist}</p>
                        <p id="search-display-year">{displayData.resultYear}</p>
                    </>)
                }

                {type === 'artist' && 
                (<>
                    {
                        displayData.resultArtist.length > 20 ?
                        (<Marquee_Text
                        text={displayData.resultArtist}
                        bold={true}
                        id={'search-display-artist'}/>)
                        :
                        <p id="search-display-artist">{displayData.resultArtist}</p>
                    }

                    {displayData.resultGenres.length > 0 &&
                    displayData.resultGenres.slice(0, 3).map((genre, index) => {
                        return <p key={index}>{genre}</p>
                    })}
                </>)
                }
            </div>
        </div>
    )
}