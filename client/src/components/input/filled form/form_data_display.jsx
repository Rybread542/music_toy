import { useEffect, useMemo } from "react"
import { Marquee_Text } from "../../misc/marquee_text"
import { motion, useReducedMotion, useAnimate } from 'motion/react'


export function Form_Data_Display({formData}) {

    const reduceMotion = useReducedMotion()

    const [scope, animate ] = useAnimate()

    const rangeLabel = useMemo(() => {
        const [ dateStart, dateEnd ] = formData.formData.dateRange
        const start = dateStart < 1940 ? '<1940' : dateStart
        const end = dateEnd > 2020 ? '2020+' : dateEnd
        return (start === '<1940' && end === '2020+') ? 'All' : `${start} - ${end}`
    }, [formData.formData.dateRange])

    

    const driftAnimation = reduceMotion ? 
    {}
    :
    {
        rotateX: [0, -6, 0, -6, 0, 6],
        rotateY: [0, 6, 0, -6, 0, 6],
        transition: {
            duration: 30,
            ease: 'easeIn',
            repeat: Infinity,
            repeatType: 'mirror',
            delay: 2
        },
        times: [0, .25, .5, .75, 1]
    }

    async function animateSeq() {
        await animate(scope.current, 
            {
                opacity: 1
            },
            {
                duration: 2, 
                delay: 2.75
            }
        )

        await animate(scope.current,
            {
                rotateX: [0, -6, -6, 6, 6],
                rotateY: [0, 6, -6, 6, -6],
            },
            {
                duration: 25,
                ease: 'easeIn',
                repeat: Infinity,
                repeatType: 'mirror',
                delay: 2,
                times: [0, .25, .5, .75, 1]
            },

        )
    }

    useEffect(() =>{
        animateSeq()
    }, [])

    return (

        <motion.div className="form-data-display-container"
        ref={scope}
        initial={{opacity: 0}}
        style={{
            willChange: 'transform', 
            transformPerspective: 800, 
            }}
        exit= {{scale: 0, y:1000, transition: {duration: 1, ease: [0.35, 0, 0.65, 0.35]}}}
            >

            <div className="form-data-display">

                <div className="form-display-output-type">
                    <p>I'm looking for <span className="type-span">{(formData.formData.outputType === 'track' ? 'song' : formData.formData.outputType)+ 's'}</span></p>
                </div>

                <div className="form-display-input-type">
                    <p>similar to this <span className="type-span">{formData.formData.inputType === 'track' ? 'song' : formData.formData.inputType}</span></p>
                </div>

                <div className="form-display-input-info">

                    <div className="input-info-img">
                        <img src={formData.displayData.resultImg} alt="" />
                    </div>

                    {formData.formData.inputType != 'artist' &&
                    <div className="input-info">
                        {formData.displayData.resultTitle.length > 20 ?
                        <Marquee_Text text={formData.displayData.resultTitle}
                        id={'input-info-display-title'}
                        bold={true}
                        maxWidth="7rem"/>
                        :
                        <p style={{fontWeight: 'bold'}} className='input-info-display-title'>{formData.displayData.resultTitle}</p>
                        }

                        <p className='input-info-display-artist'>{formData.displayData.resultArtist}</p>
                        <p className='input-info-display-year'>{formData.displayData.resultYear}</p>
                    </div>}

                    {formData.formData.inputType === 'artist' &&
                    <div className="input-info">

                        {formData.displayData.resultArtist.length > 10 ?
                        <Marquee_Text text={formData.displayData.resultArtist}
                        id={'input-info-display-artist'}
                        bold={true}/>
                        :
                        <p className="result-display-artist">{formData.displayData.resultArtist}</p>
                        }   

                        {(formData.displayData.resultGenres && formData.displayData.resultGenres.length > 0) &&
                        formData.displayData.resultGenres.slice(0, 3).map((genre, index) => {
                            return <p className="result-display-genre" key={index}>{genre}</p>
                        })}
                    </div>}

                </div>

                <div className="form-display-output-options">
                    <div className="form-display-option" id='date-range'>
                        <i className="fa-solid fa-calendar"></i>
                        <p>{rangeLabel}</p>
                    </div>

                    <div className="form-display-option" id='variety-val'>
                        <i className="fa-solid fa-clover"></i>
                        <p>{formData.formData.popVal}</p>
                    </div>
                    {formData.formData.inputComment && (
                        <div className="form-display-comment">
                            <p>{formData.formData.inputComment}</p>
                        </div>
                    )}
                </div>

            </div>

            
        </motion.div>
    )

}