import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { headerInfo } from "../../../util/config";

export function Header_Info() {


    const [ isOpen, setIsOpen ] = useState(false)
    const infoRef = useRef(null)
    useEffect(() => {

        const handleClick = (e) => {
            setIsOpen(false)
        }

        document.addEventListener('click', handleClick)

        return () => {
            document.removeEventListener('click', handleClick)
        }
    }, [infoRef])
    
    return (
        <div className="header-info-container">
            <AnimatePresence>

                <motion.div className="header-info-icon"
                whileHover={{y: -2}}
                onClick={(e) => {
                    e.stopPropagation()
                    setIsOpen(o => !o)
                }}
                key={'header-info-icon'}>
                    <i className="fa-solid fa-question"></i>
                </motion.div>
    
               {isOpen &&
                <motion.div className="header-info-text-container"
                key={'header-info-container'}
                initial={{opacity: 0}}
                animate={{opacity: 1}}
                exit={{opacity: 0}}
                transition={{duration: 0.3, ease: 'easeOut'}}
                ref={infoRef}
                >

                    <div className="header-info-text">
                        <p>{headerInfo}</p>
                    </div>

                </motion.div>
                }

            </AnimatePresence>
        </div>
    )

}