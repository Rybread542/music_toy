

export function Output_Results({outputData}) {


    return (
        <div className="output-results-container">
            <div className="output-results">
                {outputData?.map((item, index) => {
                    return (
                        <div className="output-results-item" key={index}>
                            <div className="output-item-details">
                                <div className="output-item-img">
                                    <img src={null} alt="" />
                                </div>
                                <div className="output-item-info">
                                    {item.type === "album" || item.type === "song" ?
                                    (<>
                                        <p>{item.title}</p>
                                        <p>{item.artist}</p>
                                        <p>{item.year}</p>
                                    </>)
                                    :
                                    (<>
                                        <p>Genre</p>
                                        <p>Genre</p>
                                        <p>Genre</p>
                                    </>)}
                                </div>
                            </div>
                            <div className="output-item-links">
                                <p>{item.spotifyLink}</p>
                                <p>link 2</p>
                                <p>link 3</p>
                            </div>
                        </div>
                    )
                })}
            </div>

        </div>
    )

}