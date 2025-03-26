import { useState } from "react"

export function Input_Search_Display({type, artist, title, loading}) {


    if (loading) {
        return (
        <div className="input-form-result-display">
            <p>...</p>
        </div>
        )
    }

    else {
        if (!loading && !searchData) {
            return (
                <div className="input-form-result-display">
                    <div className="result-display-img">
                        <img src={null} alt="" />
                    </div>
                    <div className="result-display-info">
                        <p id="result-display-title">{title}</p>
                        <p id="result-display-artist">{artist}</p>
                    </div>
                </div>
            )
        }

        if (!loading && searchData) {
            return (

                <div className="input-form-result-display">
                    <div className="result-display-img">
                        <img src={searchData.resultImg ? searchData.resultImg : null} alt="" />
                    </div>

                    <div className="result-display-info">

                        {
                        type != 'artist' && 
                        (<>
                            <p id="result-display-title">{searchData.resultTitle}</p>
                            <p id="result-display-artist">{searchData.resultArtist}</p>
                            <p id="result-display-year">{searchData.resultYear}</p>
                        </>)
                        }

                        {
                        type === 'artist' && 
                        (<>
                            <p id="result-display-artist">{searchData.resultArtist}</p>
                        </>)
                        }

                    </div>
                </div>
            )
        }
    }
}