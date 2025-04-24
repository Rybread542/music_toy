import { useState, useRef, useEffect } from "react"
import { Marquee_Text } from "../misc/marquee_text"
import { motion, useReducedMotion } from 'motion/react'
import { getFloatArray } from "../../util/floatAnimationArray"
import { Memo_Image } from "../misc/optimized_img"
import { useWindowDimensions } from "../../hooks/windowDimensions"



export function Output_Result_Item({item, index, img, token, front}) {

    const [variant, setVariant] = useState('rest')
    const [width, height] = useWindowDimensions()
    const mobileHeight = height < 600

    const reduceMotion = useReducedMotion()

    const handleSelect = () => {
        setVariant(v => (v === 'selected' ? 'rest' : 'selected'))
    }

    useEffect(()=> {
        setVariant('rest')
    }, [token, width])

    
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
        initial: {
            opacity: 0,
            bottom: 0,
            left:0, 
        },

        rest: {
            opacity: 0,
            bottom: 0,
            left: 0,
            transition: {type: 'spring', bounce: 0, duration: 0.3}
        },

        hover: {
            opacity: 1,
            x: mobileHeight ? '8rem' :  0,
            y: mobileHeight ? 0 : '105%',
            zIndex: 1,
            transition: {type: 'spring', bounce: 0, ease: 'easeOut'}
        },

        selected: {
            opacity: 1,
            x: mobileHeight ? '8rem' :  0,
            y: mobileHeight ? 0 : '105%',
            zIndex: 1,
            transition: {type: 'spring', bounce: 0, ease: 'easeOut'}
        }
    }

    const linksVariants = {
        initial: {
            opacity: 0,
            top: 0,
            right: 0, 
        },

        rest: {
            opacity: 0,
            top: 0,
            right: 0,
            transition: {type: 'spring', bounce: 0, duration: 0.3}
        },

        hover: {
            opacity: 1,
            x: 45,
            zIndex: 1,
            transition: {type: 'spring', bounce: 0, ease: 'easeOut'}
        },

        selected: {
            opacity: 1,
            x: 45,
            zIndex: 1,
            transition: {type: 'spring', bounce: 0, ease: 'easeOut'}
        }
    }

    const itemVariants = {
        initial: {
            scale: 0
        },
        
        selected: {scale: 1},
        rest: {scale: 1},
        hover: {y: -15, scale: 1},
        tap: {y: 5, scale: 0.95},
        drift: driftAnimation
    }

    const imgVariants = {
        rest: {opacity: 1},
        selected: {opacity: 1},
        hover: {opacity: 1},
        tap: {opacity: 1},
    }

    const imageError = (e) => {
        e.target.src = `/images/${item.outputType === 'artist' ? 'artist-photo-default.png' : 'album-art-default.png'}`
    }


    return (
            
            <motion.div className="output-results-item"
            variants={itemVariants}
            initial= 'initial'
            whileTap='tap'
            whileInView='drift'
            animate={variant}
            onClick={handleSelect}
            onHoverStart={() => variant !== 'selected' && setVariant('hover')}
            onHoverEnd  ={() => variant !== 'selected' && setVariant('rest')}
            style={{willChange: 'transform',
                transformPerspective: 800,
                pointerEvents: front ? 'auto':'none'
                }}
            >
                <div className="output-item-details">

                    <motion.div className="output-item-img" 
                    variants={imgVariants}
                    initial={false}>
                        {img ? 
                        <Memo_Image
                        url={img}
                        width={200}
                        height={200}
                        className={'output-item-img-inner'}/>
                        :
                        <img src={item.outputType === 'artist' ? '/images/artist-photo-default.png' : '/images/album-art-default.png'} 
                        alt={item.outputType === 'artist' ? item.outputArtist : item.outputTitle} 
                        onError={imageError}/>
                        }
                        
                    </motion.div>

                    <motion.div className="output-item-info"
                    variants={itemInfoVariants}>
                        {item.outputType === "album" || item.outputType === "track" ?
                        (<>
                            {item.outputTitle.length > 20 ?
                                <Marquee_Text
                                text={item.outputTitle}
                                bold={true}
                                id={'output-item-title'}
                                maxWidth="15rem"/>
                                :
                                <p style={{fontWeight : 'bold'}} className='output-item-title'>{item.outputTitle}</p>
                            }
                            {item.outputArtist.length > 20 ?
                                <Marquee_Text
                                text={item.outputArtist}
                                bold={false}
                                id={'output-item-artist'}
                                maxWidth="15rem"/>
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
                    variants={linksVariants}>
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