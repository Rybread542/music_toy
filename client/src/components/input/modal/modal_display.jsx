import { createPortal } from "react-dom";
import { motion, AnimatePresence } from 'motion/react'


export function Modal_Display({children}) {

    return createPortal(
        <motion.div className="modal-container"
        initial={{opacity: 0}}
        animate={{opacity: 1}}
        exit={{opacity: 0}}
        transition={{delay: 1, duration: 0.75, ease: 'easeIn'}}>
            {children}
        </motion.div>,
        document.body
    )
}