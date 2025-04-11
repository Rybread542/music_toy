import { Slider } from '@mui/material'
import { motion, AnimatePresence } from 'motion/react'




export function Output_Options({
    comment, 
    setComment, 
    dateRange, 
    handleDateRangeUpdate, 
    popVal, 
    handlePopValUpdate,
    outputType}) {

    const dateRangeStart = () => {
        if (dateRange[0] < 1940) {
            return '<1940'
        }
        else {
            return dateRange[0]
        }
        
    }

    const dateRangeEnd = () => {
        if (dateRange[1] > 2020) {
            return '2020+'
        }

        else {
            return dateRange[1]
        }
    }

    
    return (
        <AnimatePresence propagate>
            <motion.div className="output-options-container"
                exit={{opacity: 0}}>
                <div className="output-options-comment">
                    <motion.textarea
                        className='form-textarea'
                        placeholder="Additional details..."
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
                        layout
                    />
                </div>
            
                <motion.div className="output-options-sliders"
                layout>
                {outputType != 'artist' &&
                    (<div className="output-options-dates">
                        <span className="output-options-date-label">
                            <p>Date range</p>
                            <div className="date-range-label">
                                <p>{dateRangeStart()}</p>
                            </div>
                            <div className="date-range-label">
                                <p>{dateRangeEnd()}</p>
                            </div>
                        </span>
                        <Slider
                            size='small'
                            className='output-options-slider'
                            value={dateRange}
                            disableSwap
                            onChange={handleDateRangeUpdate}
                            valueLabelDisplay='off'
                            min={1930}
                            max={2030}
                            step={10}
                            sx={{color: 'var(--accent-color-lighter-greyblue)'}}
                        />
                    </div>)
                }

                    <div className="output-options-variety">
                        <div className="output-options-variety-label">
                            <p>Variety</p>
                            <p className="variety-label">{popVal}</p>
                        </div>
                        <Slider
                            size='small'
                            className='output-options-slider'
                            value={popVal}
                            onChange={handlePopValUpdate}
                            valueLabelDisplay='off'
                            sx={{color: 'var(--accent-color-lighter-greyblue)'}}
                        />
                    </div>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    )
}