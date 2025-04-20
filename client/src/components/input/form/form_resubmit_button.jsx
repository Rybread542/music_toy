import { motion } from 'motion/react'

export function Form_Resubmit_Button({handleResubmit}) {

    return (
        <motion.div className="form-resubmit-button-container"
        initial={{scale: 0, pointerEvents: 'none'}}
        animate={{scale : 1, pointerEvents: 'auto'}}
        exit={{scale: 0, pointerEvents: 'none'}}
        whileHover={{rotate: 20}}
        whileTap={{rotate: 360}}
        layout>
            <button type="button" onClick={handleResubmit}
            className={"form-resubmit-button"}
            title='Resubmit'>
                <i className="fa-solid fa-arrows-rotate"></i>
            </button>
        </motion.div>
    )
}   