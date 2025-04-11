import { Modal_Button } from "../modal/modal_button";
import { AnimatePresence, motion, LayoutGroup, useReducedMotion } from "motion/react"


export function Form_Steps_Wrapper ({children, 
    handleFormSubmit,
    formStep, 
    setFormStep, 
    inputConfirmed
    }) {

    const reduceMotion = useReducedMotion()

    const driftAnimation = reduceMotion ? 
    {}
    :
    {
        rotateX: [0, -6, -6, 6, 6],
        rotateY: [0, 6, -6, 6, -6],
        transition: {
            duration: 30,
            ease: 'easeIn',
            repeat: Infinity,
            repeatType: 'mirror'
        },
        times: [0, .25, .5, .75, 1]
    }

    return (
        <LayoutGroup>
            <AnimatePresence propagate>
                <motion.div 
                    className="input-form-container"
                    layout
                    animate={driftAnimation}
                    style={{willChange: 'transform', 
                        transformPerspective: 800, 
                        }}
                    exit={{scale: 0, 
                        width: 0,
                        height: 0, 
                        top: 350,
                        borderRadius: '500px', 
                        overflow: 'hidden',
                        transition: {delay: 0.5, duration: 1, ease: [.31,.37,.33,.92]}}}>

                    <div className="input-form-modal">
                            {children}
                    </div>  

                    <AnimatePresence propagate>
                        {((formStep === 1) || (formStep === 2 && inputConfirmed)) &&
                        <Modal_Button 
                        direction={'next'} 
                        handleButtonClick={() => setFormStep(formStep+1)}
                        key={'next-' + formStep}/>}

                        {formStep > 1 &&
                        <Modal_Button 
                        direction={'back'} 
                        handleButtonClick={() => setFormStep(formStep-1)}
                        key={'back-' + formStep}/>}

                        {formStep === 3 && (
                            <motion.div className="submit-button-container"
                            initial={{opacity: 0}}
                            animate={{opacity: 1}}
                            transition={{delay: 0.8}}
                            exit={{opacity: 0, transition: {duration: 0}}}
                            key={'submit'}>
                                <button className='form-submit-button' 
                                onClick={handleFormSubmit}>
                                    <i className="fa-solid fa-play"></i>
                                </button>
                            </motion.div>
                            )
                        }
                    </AnimatePresence>
                    

                </motion.div>
            </AnimatePresence>
        </LayoutGroup>
    )
}