import { motion } from "motion/react";


export function Output_Cycle_Button({onClick}) {


    return (
        <motion.div className="output-cycle-button-container"
        initial={{scale: 0}}
        animate={{scale: 1}}
        whileHover={{y: -5}}
        whileTap={{y: 2}}
        exit={{scale: 0}}>
            <button className="output-cycle-button" onClick={onClick}>
                <i className="fa-solid fa-arrow-up"></i>
            </button>
        </motion.div>
    )
}