import { motion, useReducedMotion } from "motion/react";
import { getFloatArray } from "../../../util/floatAnimationArray";

export function Header() {

    const reduceMotion = useReducedMotion()

    const driftAnimation = reduceMotion ? 
        {}
        :
        {
            rotateX: getFloatArray(7),
            rotateY: getFloatArray(7),
            transition: {
                duration: 20,
                ease: 'easeIn',
                repeat: Infinity,
                repeatType: 'mirror',
                times: [0, .25, .5, .75, 1]
            },
            
        }

    const swirlVariants = {
        rest: {
            rotate: -720,
            '--header-swirl-1': ['#5A24FF', '#2600FF'],
            '--header-swirl-2': ['#007BFF', '#38DFFF'],
            '--header-swirl-3': ['#C327FF', '#FF00C8'],
            '--header-swirl-4': ['#2204a8', '#3575ff'],

            transition: {
                rotate:  { duration: 25, ease: 'linear',  repeat: Infinity },
                default: { duration: 5,  ease: 'easeInOut', repeat: Infinity, repeatType: 'mirror' }
                }
        },

        press: {
            rotate: 360,
            '--header-swirl-1': ['#A5DB00', '#D9FF00'],
            '--header-swirl-2': ['#FF8400', '#C72000'],
            '--header-swirl-3': ['#3CD800', '#00FF37'],
            '--header-swirl-4': ['#F0FB57', '#CA8A00'],
            transition: {
                '--header-swirl-1': {duration: 1.6, repeat: Infinity, repeatType: 'mirror'},
                '--header-swirl-2': {duration: 1.6, repeat: Infinity, repeatType: 'mirror'},
                '--header-swirl-3': {duration: 1.6, repeat: Infinity, repeatType: 'mirror'},
                '--header-swirl-4': {duration: 1.6, repeat: Infinity, repeatType: 'mirror'},
                default: { duration: 15, repeat: Infinity, ease: 'linear' } }
          }

    }

    return (
        <motion.div className="header-drag-container"
        animate={driftAnimation}
        style={{
            willChange: 'transform',
            transformPerspective: 800
        }}

        drag
        dragConstraints={{top: 0, bottom: 0, left: 0, right: 0}}
        dragElastic={1}
        dragPropagation={true}>

            <motion.div className="header-inner-container"
            variants={swirlVariants}
            animate='rest'
            whileTap='press'
            />
            
                <div className="header-text">
                    <h2>Myx</h2>
                </div>
        </motion.div>
    )
}