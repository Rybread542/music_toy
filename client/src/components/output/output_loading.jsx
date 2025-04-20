import {motion, AnimatePresence} from 'motion/react'

export function Output_Loading() {

    const rad = 10
    const degrees = [0, 120, 240]

    return (
            <motion.div className='output-load-container'
            initial={{opacity: 0,
                position: 'absolute',
                top: '75%'
            }}
            animate={{
                opacity: 1, 
                rotate: 360
            }}

            transition={{
                rotate: 
                {   
                repeat: Infinity,
                repeatType: 'loop',
                duration: 3,
                ease: 'linear',
                },
                delay: 2,
                duration: 2
            }}

            exit={{
                opacity: 0,
                transition: {
                    duration: 0.5
                    }
                }}>

                {
                degrees.map((deg) => {
                    return ( 

                    <motion.div className='output-load-dot'
                    key={deg}
                    initial={{
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)'
                        }}
                    animate={{
                        transform: `translate(-50%, -50%) rotate(${deg}deg) translate(${rad}px, 0)`
                    }}
                    transition={{
                        duration: 1.5,
                        ease: 'easeInOut',
                        delay: 2.5
                    }}>
                    </motion.div>

                    )
                })
                }
                
            </motion.div>
    )
    

}