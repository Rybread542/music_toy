import { Output_Result_Item } from "./output_result_item"
import { keyframes, motion } from "motion/react"

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

    const containerVariants = {
        initial: {scale: 1},
        rest: {transition: {delay: 1, staggerChildren: 0.2}}
    }

    const itemVariants = {
        initial: {scale: 0, position: 'absolute', top: -100},
        rest: {scale: 1, top: 0, position: 'static', transition: {duration: 0.75}}
    }
    
    return (
        <div className="output-results-container">
            <motion.div className="output-results"
            variants={containerVariants}
            initial='initial'
            animate='rest'>

                {error && (
                    <div className="error-container">
                        <p>{error}</p>
                    </div>
                )}

                
                {outputData?.map((item, index) => {
                    const img = imgUrl(item)
                    
                    return (
                    <motion.div key={img} variants={itemVariants}>
                        <Output_Result_Item
                                item={item}
                                index={index}
                                img={img}
                                />
                    </motion.div>
                    )
                    
                })}
                
            </motion.div>

        </div>
    )

}