import { Load_Spinner } from "../../../../../misc/load_spinner";
import { Marquee_Text } from "../../../../../misc/marquee_text";
import { motion } from "motion/react";
import { Memo_Image } from "../../../../../misc/optimized_img";
import { noResultsMessage } from "../../../../../../util/config";


export function Input_Search_Display({displayData, loading, type}) {

    if(loading) {
        return ( 
        <Load_Spinner width={'30px'} height={'30px'} opacity={'0.7'}/>
        )
    }

    else if (!displayData.resultArtist) {
        return (
            <motion.div className="input-search-display"
            initial={{opacity: 0}}
            animate={{opacity: 1}}
            transition={{delay: 0.3}}>
                <p>{noResultsMessage}</p>
            </motion.div>
        )
    }

    return (

        <motion.div className="input-search-display"
            initial={{opacity: 0}}
            animate={{opacity: 1}}
            transition={{delay: 0.3}}>

            <motion.div className="search-display-img"
            initial={{opacity: 0}}
            animate={{opacity: 1}}
            transition={{delay: 1.5}}>
                
                

                {displayData.resultImg ?
                <Memo_Image className={'search-display-img-inner'} 
                url={displayData.resultImg}
                width={150} height={150}/>
                :
                <img src='images/album-art-default.png' alt={displayData.resultTitle}/>
                }
                
            </motion.div>

            <div className="search-display-info">

                {type != 'artist' && 
                    (<>
                        {
                            displayData.resultTitle.length > 20 ?
                            (<Marquee_Text
                            text={displayData.resultTitle}
                            bold={true}
                            id={'search-display-title'}
                            maxWidth="7rem"/>)
                            :
                            <p style={{fontWeight : 'bold'}} id="search-display-title">{displayData.resultTitle}</p>
                        }

                        {
                            displayData.resultArtist.length > 20 ?
                            (<Marquee_Text
                            text={displayData.resultArtist}
                            bold={true}
                            id={'search-display-artist'}
                            maxWidth="7rem"/>)
                            :
                            <p id="search-display-artist">{displayData.resultArtist}</p>
                        }
                        
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