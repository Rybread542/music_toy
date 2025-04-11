import { Load_Spinner } from "../../../../../misc/load_spinner";
import { Marquee_Text } from "../../../../../misc/marquee_text";
import { motion } from "motion/react";


export function Input_Search_Display({displayData, loading, type}) {

    if(loading) {
        return ( 
        <Load_Spinner width={'30px'} height={'30px'} opacity={'0.7'}/>
        )
    }

    return (

        <motion.div className="input-search-display"
            initial={{opacity: 0}}
            animate={{opacity: 1}}
            transition={{delay: 0.3}}>
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
                            <p style={{fontWeight : 'bold'}} id="search-display-title">{displayData.resultTitle}</p>
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
                        <p style={{fontWeight : 'bold'}} id="search-display-artist">{displayData.resultArtist}</p>
                    }

                    {displayData.resultGenres.length > 0 &&
                    displayData.resultGenres.slice(0, 3).map((genre, index) => {
                        return <p key={index}>{genre}</p>
                    })}
                </>)
                }
            </div>
        </motion.div>
    )
}