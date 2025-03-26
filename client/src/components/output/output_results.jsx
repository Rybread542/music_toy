

export function Output_Results({outputData, error}) {


    return (
        <div className="output-results-container">
            <div className="output-results">
                {error && (
                    <div className="error-container">
                        <p>{error}</p>
                    </div>
                )}
                {outputData?.map((item, index) => {
                    return (
                        <div className="output-results-item" key={index}>
                            <div className="output-item-details">
                                <div className="output-item-img">
                                    <img src={null} alt="" />
                                </div>
                                <div className="output-item-info">

                                    {item.outputType === "album" || item.outputType === "track" ?

                                    (<>
                                        <p>{item.outputTitle}</p>
                                        <p>{item.outputArtist}</p>
                                        <p>{item.outputYear}</p>
                                    </>)

                                    :

                                    (<>
                                        <p>{item.outputArtist}</p>
                                        {JSON.parse(item.outputGenres.replace(/'/g, '"'))?.slice(0, 3).map((item, index) => {
                                            return <p key={index}>{item}</p>
                                        })}
                                    </>)}

                                </div>
                            </div>
                            <div className="output-item-links">
                                {item.spotifyLink && 
                                <a href={item.spotifyLink} target="_blank">Spotify</a>}
                                {item.youtubeLink && 
                                <a href={item.youtubeLink} target="_blank">Youtube</a>}
                            </div>
                        </div>
                    )
                })}
            </div>

        </div>
    )

}