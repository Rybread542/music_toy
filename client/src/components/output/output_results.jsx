import { Output_Result_Item } from "./output_result_item"
import { AnimatePresence, motion } from "motion/react"

export function Output_Results({outputData, error}) {

    const imgUrl = (item) => {
        if (item.outputType === 'artist') {
            return item.artistPhoto ?
            item.artistPhoto 
            :
            'artist-photo-default.png'
        }

        else {
            return item.albumArt ? 
            item.albumArt 
            :
            'album-art-default.png'
        }
    }

    const componentVariants = {
        initial: {scale: 1},
        rest: {scale: 1, transition: {delay: 1, staggerChildren: 0.2}},
        exit: {transition: {staggerChildren: 0.2}}
    }

    const itemVariants = {
        initial: {scale: 0, position: 'absolute', top: -100},
        rest: {scale: 1, top: 0, position: 'static', transition: {duration: 0.75}},
        exit: {scale: 0, y:1000, transition: {duration: 1, ease: [0.35, 0, 0.65, 0.35]}}
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
                        <div className="error-container">
                            <p>{error}</p>
                        </div>
                    )}

                    {outputData?.map((item, index) => {
                        const img = imgUrl(item)
                        
                        return (
                        <motion.div key={item.id} 
                        variants={itemVariants}
                        >
                            <Output_Result_Item
                                    item={item}
                                    index={index}
                                    img={img}
                                    />
                        </motion.div>
                        )
                        
                    })}
                </motion.div>
        </motion.div>
    )

}