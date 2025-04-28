import { useState } from "react"
import { useWindowDimensions } from "../../hooks/windowDimensions"
import { Output_Result_Item } from "./output_result_item"
import { AnimatePresence, motion } from "motion/react"
import { Output_Cycle_Button } from "./output_cycle_button"

export function Output_Results({outputData, error}) {

    const [ width, height ] = useWindowDimensions()
    const smallWidth = width <= 700
    const smallHeight = height <= 900
    const [ stackIndexes, setStackIndexes ] = useState([1, 2, 3])
    const [ cycleToken, setCycleToken ] = useState(0)

    const cycleStack = () => {
        setCycleToken(t => t+1)
        setStackIndexes((prev) => {
            return prev.map((x) => x === 3 ? 1 : x + 1)
        })
    }

    const componentVariants = {
        initial: {scale: 1},
        rest: {scale: 1, transition: {delay: 1, staggerChildren: 0.2}},
        exit: {transition: {staggerChildren: 0.2}}
    }

    
    return (
        <motion.div className="output-results-container"
        variants={componentVariants}
        initial='initial'
        animate='rest'
        exit='exit'>
                <motion.div className="output-results"
                variants={componentVariants}
                initial='initial'
                animate='rest'
                exit='exit'>

                    {error && (
                        <motion.div className="error-container"
                        initial={{opacity: 0}}
                        animate={{opacity: 1}}
                        exit={{opacity: 0}}>
                            <p>{error}</p>
                        </motion.div>
                    )}

                    
                    {outputData.length > 0 &&
                    
                    outputData.map((item, index) => {

                        const stackedView = {
                            position: 'absolute',
                            zIndex: stackIndexes[index],
                            y: `calc(-50% + ${index*18}px)`,
                            top: smallHeight ? '25%':'50%',
                            left: '50%'
                        }


                        return (
                        
                            <motion.div key={item.outputArtist} 
                            variants={
                                {
                                    initial: {scale: 0},
                                    rest: {
                                        scale: 1, 
                                        x: smallWidth ? '-50%': 0, 
                                        y: smallWidth ? `calc(-50% + ${stackIndexes[index]*18}px)`: 0, 
                                        transition: {duration: 0.3, ease: 'easeOut'}
                                    },
                                    exit: {
                                        scale: 0, 
                                        y:1000, 
                                        transition: {duration: 1, ease: [0.35, 0, 0.65, 0.35]}}
                                }
                            }

                            style={smallWidth ? stackedView : {zIndex: 3}}
                            >
                                <Output_Result_Item 
                                item={item} 
                                index={index} 
                                img={item.outputType === 'artist' ? item.artistPhoto : item.albumArt}
                                token={cycleToken}
                                front={smallWidth ? stackIndexes[index] === 3 : true} 
                                />

                            </motion.div>
                        
                        )
                        
                    })}
                
                <AnimatePresence>
                    {smallWidth &&
                        <Output_Cycle_Button onClick={cycleStack}/>
                    }
                </AnimatePresence>

                </motion.div>
        </motion.div>
    )

}