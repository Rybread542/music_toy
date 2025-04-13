import { motion } from "motion/react"

export function Modal_Button({direction, handleButtonClick}) {


    return (
        <motion.div className={direction + "-modal-button-container"}
        initial={{opacity: 0}}
        animate={{opacity: 1}}
        transition={{delay: 0.8}}
        exit={{opacity: 0, transition: {duration: 0}}}>
            <motion.button type="button" onClick={handleButtonClick} 
            className="modal-button"
            whileHover={{backgroundColor: 'var(--accent-color-lighter-greyblue-highlight)',
                color: 'var(--font-secondary-dark)'
            }}
            whileTap={{y: 2}}
            layout>
                {direction === 'next' ? 
                (<i className="fa-solid fa-arrow-right-long"></i>)
                : 
                <i className="fa-solid fa-arrow-left-long"></i>}
            </motion.button>
        </motion.div>
    )

}