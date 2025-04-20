import { motion } from 'motion/react'

export function Input_Reset_Button({handleReset, disabled}) {

    return (
        <motion.div className="input-reset-button-container"
        initial={{scale: 0, pointerEvents: 'none'}}
        animate={{scale : 1, pointerEvents: 'auto'}}
        exit={{scale: 0, pointerEvents: 'none'}}
        whileHover={{rotate: 20}}
        whileTap={{rotate: 360}}
        layout>
            <button type="button" onClick={handleReset} 
            className={"input-reset-button"}
            disabled={disabled}
            title='Reset'>
                <i className="fa-solid fa-arrow-rotate-right"></i>
            </button>
        </motion.div>
    )
}   