import { Modal_Button } from "../modal/modal_button";
import { AnimatePresence, motion } from "motion/react"


export function Form_Steps_Wrapper ({children, 
    handleFormSubmit,
    formStep, 
    setFormStep, 
    inputConfirmed}) {


    return (
        
        <div className="input-form-container">
            <AnimatePresence mode="wait">
                <motion.div 
                    className="input-form-modal"
                    layout>
                        {children}
                    {formStep === 3 && (
                        <div className="submit-button-container">
                            <button className='form-submit-button' 
                            onClick={handleFormSubmit}>
                                <i className="fa-solid fa-play"></i>
                            </button>
                        </div>
                        )
                    }
                    {((formStep === 1) || (formStep === 2 && inputConfirmed)) &&
                    <Modal_Button 
                    direction={'next'} 
                    handleButtonClick={() => setFormStep(formStep+1)}/>}

                    {formStep > 1 &&
                    <Modal_Button 
                    direction={'back'} 
                    handleButtonClick={() => setFormStep(formStep-1)}/>}
                </motion.div>  
            </AnimatePresence>
        </div>
    )
}