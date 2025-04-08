import { Marquee_Text } from "../misc/marquee_text"


export function Output_Result_Item({item, index, img}) {


    return (

        <div className="output-results-item" key={index}>

            <div className="output-item-details">

                <div className="output-item-img">
                    <img src={img} alt={item.outputType === 'artist' ? item.outputArtist : item.outputTitle} />
                </div>

                <div className="output-item-info">

                    {item.outputType === "album" || item.outputType === "track" ?

                    (<>
                        {item.outputTitle.length > 20 ?
                            <Marquee_Text
                            text={item.outputTitle}
                            bold={true}
                            id={'output-item-title'}
                            maxWidth="8rem"/>
                            :
                            <p style={{fontWeight : 'bold'}} className='output-item-title'>{item.outputTitle}</p>
                        }

                        <p  className='output-item-artist'>{item.outputArtist}</p>
                        <p  className='output-item-year'>{item.outputYear}</p>
                    </>)

                    :

                    (<>
                        {item.outputArtist.length > 20 ?
                            <Marquee_Text
                            text={item.outputArtist}
                            bold={true}
                            id={'output-item-artist'}
                            maxWidth="8rem"/>
                            :
                            <p className='output-item-artist'>{item.outputArtist}</p>
                        }

                        {JSON.parse(item.outputGenres.replace(/'/g, '"'))?.slice(0, 3).map((item, index) => {
                            return <p key={index}>{item}</p>
                        })}
                    </>)}

                </div>

            </div>

            <div className="output-item-links">

                {item.spotifyLink && 
                <a href={item.spotifyLink} target="_blank" className="output-item-link-icon" id='spotify-icon'>
                    <i className="fa-brands fa-spotify"></i>
                </a>}

                {item.youtubeLink && 
                <a href={item.youtubeLink} target="_blank" className="output-item-link-icon" id='youtube-icon'>
                    <i className="fa-brands fa-youtube"></i>
                </a>}

            </div>

        </div>
    )
}