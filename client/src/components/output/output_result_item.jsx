import { useState } from "react"
import { Marquee_Text } from "../misc/marquee_text"
import { motion, useReducedMotion } from 'motion/react'
import { getFloatArray } from "../../util/floatAnimationArray"



export function Output_Result_Item({item, index, img}) {

    const [ selected, setSelected ] = useState(false)
    const reduceMotion = useReducedMotion()

    
    const driftAnimation = reduceMotion ? 
    {}
    :
    {
        rotateX: getFloatArray(7),
        rotateY: getFloatArray(7),
        transition: {
            duration: 20,
            ease: 'easeIn',
            repeat: Infinity,
            repeatType: 'mirror',
            times: [0, .25, .5, .75, 1]
        },
        
    }


    const itemInfoVariants = {
        rest: {},
        hover: {
            opacity: 1,
            y: 100,
            zIndex: 1
        }
    }

    const linksVariants = {
        rest: {},
        hover: {
            opacity: 1,
            y: 150,
            zIndex: 1
        }
    }

    const itemVariants = {
        initial: {
            scale: 0
        },
        
        rest: {scale: 1},
        hover: {y: -15, scale: 1},
        tap: {y: 5, scale: 0.95},
        drift: driftAnimation
    }

    const imgVariants = {
        initial: {opacity: 0},
        rest: {opacity: 1, transition: {delay: 1, duration: 0.6}},
        hover: {opacity: 1},
        tap: {opacity: 1},
    }


    return (
            
            <motion.div className="output-results-item"
            variants={itemVariants}
            initial= 'initial'
            whileHover='hover'
            whileTap='tap'
            whileInView='drift'
            animate={selected ? 'hover' : 'rest'}
            onClick={() => setSelected((select) => !select)}
            style={{willChange: 'transform',
                transformPerspective: 800,
                }}
            key={index}
            >
                <div className="output-item-details">
                    <motion.div className="output-item-img" variants={imgVariants}>
                        <img src={img} alt={item.outputType === 'artist' ? item.outputArtist : item.outputTitle} />
                    </motion.div>
                    <motion.div className="output-item-info"
                    initial={{bottom: 0, left: 0, opacity: 0}}
                    variants={itemInfoVariants}>
                        {item.outputType === "album" || item.outputType === "track" ?
                        (<>
                            {item.outputTitle.length > 20 ?
                                <Marquee_Text
                                text={item.outputTitle}
                                bold={true}
                                id={'output-item-title'}
                                maxWidth="10rem"/>
                                :
                                <p style={{fontWeight : 'bold'}} className='output-item-title'>{item.outputTitle}</p>
                            }
                            {item.outputArtist.length > 20 ?
                                <Marquee_Text
                                text={item.outputArtist}
                                bold={false}
                                id={'output-item-artist'}
                                maxWidth="10rem"/>
                                :
                                <p className='output-item-artist'>{item.outputArtist}</p>
                            }
                            <p  className='output-item-year'>{item.outputYear}</p>
                        </>)
                        :
                        (<>
                            {item.outputArtist.length > 20 ?
                                <Marquee_Text
                                text={item.outputArtist}
                                bold={true}
                                id={'output-item-artist'}
                                maxWidth="10rem"/>
                                :
                                <p className='output-item-artist'>{item.outputArtist}</p>
                            }
                            {JSON.parse(item.outputGenres.replace(/'/g, '"'))?.slice(0, 3).map((item, index) => {
                                return <p key={index}>{item}</p>
                            })}
                        </>)}
                    </motion.div>
                    <motion.div className="output-item-links"
                    variants={linksVariants}
                    initial={{bottom: 0, left: 0, opacity: 0}}>
                        {item.spotifyLink &&
                        <a href={item.spotifyLink} target="_blank" className="output-item-link-icon" id='spotify-icon'>
                            <i className="fa-brands fa-spotify"></i>
                        </a>}
                        {item.youtubeLink &&
                        <a href={item.youtubeLink} target="_blank" className="output-item-link-icon" id='youtube-icon'>
                            <i className="fa-brands fa-youtube"></i>
                        </a>}
                    </motion.div>
                </div>
            </motion.div>
    )
}