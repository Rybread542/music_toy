import { useState } from "react"
import { Output_Type } from "./form components/output type/output_type"
import { Form_Steps_Wrapper } from "./form_steps_wrapper"
import { Input_Type } from "./form components/input type/input_type"
import { displaySearchCall } from "../../../util/liveSearch"
import { Output_Options } from "./form components/output options/output_options"
import { AnimatePresence, motion } from "motion/react"

export function Input_Form({handleFormSubmit, setCurrentFormData}) {
    
    
    const [ formStep, setFormStep ] = useState(1)

    // output state    
    const [ outputType, setOutputType ] = useState('track')

    // input state
    const [ inputArtist, setInputArtist ] = useState('')
    const [ inputTitle, setInputTitle ] = useState('')
    const [ inputType, setInputType ] = useState('track')
    const [ inputStep, setInputStep ] = useState(1)
    const [ displayData, setDisplayData ] = useState(null)
    const [ inputConfirmed, setInputConfirmed ] = useState(false)

    // output options state
    const [ dateRange, setDateRange ] = useState([1930, 2030])
    const [ popVal, setPopVal ] = useState(50)
    const [ inputComment, setInputComment ] = useState('')


    const handleLocalSubmit = async (e) => {
        e.preventDefault()
        const formData = {
            inputType,
            outputType,
            inputArtist,
            inputTitle,
            dateRange,
            popVal,
            inputComment
        }
        
        setCurrentFormData((prevData) => {
            return {
                formData,
                displayData: {
                    ...displayData
                    }
                }
            }
        )
        console.log('set form data')
        await handleFormSubmit(formData)
    }


    //Output type handler
    
    const handleOutputTypeSelect = (e) => {
        setOutputType(e.target.value)
        clearInputSearch()
    }



    //Input Step Handlers

    const handleInputTypeSelect = (e) => {
        setInputType(e.target.value)
        clearInputSearch()
    }

    const clearInputSearch = () => {
        setInputArtist('')
        setInputTitle('')
        setInputStep(1)
        setDisplayData(null)
        setInputConfirmed(false)
    }

    const handleInputSearchChange = (val, type) => {
        type === 'artist' ? 
        setInputArtist(val)
        :
        setInputTitle(val)
    }

    const handleInputDisplaySearch = async () => {
        const searchQuery = {inputType, inputArtist, inputTitle}
        const data = await displaySearchCall(searchQuery)
        console.log(data)
        setDisplayData(data)
        setInputConfirmed(true)
    }


    //  output options handlers

    const handleDateRangeUpdate = (event, val, activeThumb) => {
            const minDistance = 10
            if(activeThumb === 0) {
                setDateRange([Math.min(val[0], dateRange[1]-minDistance), dateRange[1]])
            }

            else {
                setDateRange([dateRange[0], Math.max(val[1], dateRange[0] + minDistance)])
            }
    }
    
    const handlePopValUpdate = (event, val) => {
        setPopVal(val)
    }
    
    

    return (

            <Form_Steps_Wrapper handleFormSubmit={handleLocalSubmit} 
            formStep={formStep} 
            setFormStep={setFormStep}
            inputStep={inputStep}
            inputConfirmed={inputConfirmed}>

                        {formStep === 1 &&
                        
                            <motion.div className="output-select-container"
                            initial= {{opacity: 0}}
                            animate={{opacity: 1}}
                            exit={{opacity : 0}}
                            transition= {{delay: 0.4}}
                            >

                                <Output_Type handleOutputSelect={handleOutputTypeSelect}
                                outputType={outputType}/>

                            </motion.div>
                        
                        }

                        {formStep === 2 &&
                        
                            <motion.div className="input-type-details"
                            initial= {{opacity: 0}}
                            animate={{opacity: 1}}
                            exit={{opacity : 0}}
                            transition= {{delay: 0.4}}
                            >

                                <Input_Type 
                                inputType={inputType}
                                inputArtist={inputArtist}
                                inputTitle={inputTitle}
                                inputStep={inputStep}
                                clearInputSearch={clearInputSearch}
                                setInputStep={setInputStep}
                                displayData={displayData}
                                handleInputTypeSelect={handleInputTypeSelect}
                                handleInputSearchChange={handleInputSearchChange}
                                handleInputDisplaySearch={handleInputDisplaySearch}
                                />

                            </motion.div>
                        }

                        {formStep === 3 &&
                        <motion.div className="input-type-details"
                        initial= {{opacity: 0}}
                        animate={{opacity: 1}}
                        exit={{opacity : 0}}
                        transition= {{delay: 0.3}}
                        >
                            <Output_Options 
                            comment={inputComment} 
                            setComment={setInputComment}
                            dateRange={dateRange}
                            popVal={popVal}
                            handleDateRangeUpdate={handleDateRangeUpdate}
                            handlePopValUpdate={handlePopValUpdate}
                            outputType={outputType}
                            />
                        </motion.div>}
            </Form_Steps_Wrapper>
    )
}