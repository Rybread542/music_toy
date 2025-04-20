import { useState, useEffect, useRef } from "react";
import { AnimatePresence, motion } from "motion/react"

export function Tooltip({text}) {

    
    const [ hover, setHover ] = useState(false)
    const [ mousePos, setMousePos ] = useState({x:0, y:0})
    const hoverRef = useRef(null)

    useEffect(() => {
        const handleMouse = (e) => {
            const rect = hoverRef.current.getBoundingClientRect()
            setMousePos({ x: (e.clientX - rect.left), y: (e.clientY - rect.top) });
        }

        window.addEventListener('mousemove', handleMouse)

        return () => {
            window.removeEventListener('mousemove', handleMouse)
        }
    }, [])

    return (
        <div className="tooltip-container"
        onMouseEnter={() => setHover(true)}
        onMouseLeave={() => setHover(false)}
        ref={hoverRef}
        >
            <i className="fa-solid fa-circle-info"></i>

            <AnimatePresence>
               {hover &&
                <motion.div className="tooltip-text"
                initial={{opacity: 0}}
                animate={{opacity: 1}}
                exit={{opacity: 0}}
                transition={{duration: 0.2}}
                style={{
                    left: mousePos.x,
                    top: mousePos.y,
                }}>
                    <p>{text}</p>
                </motion.div>}
            </AnimatePresence>

        </div>
    )

}