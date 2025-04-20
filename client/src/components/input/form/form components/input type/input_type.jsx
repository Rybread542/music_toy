import { Input_Search } from "./input search display/input_search";
import { useEffect, useState, useRef } from "react";
import { Input_Search_Display } from "./input search display/input_search_display";
import { Input_Reset_Button } from "./input search display/input_reset_button";
import { motion, AnimatePresence, LayoutGroup } from "motion/react";

export function Input_Type({
    setMountKey,
    inputType, 
    inputArtist, 
    inputTitle,
    inputStep,
    setInputStep,
    displayData,
    clearInputSearch,
    handleInputTypeSelect,
    handleInputDisplaySearch,
    handleInputSearchChange
}) {

    
    const [ loading, setLoading ] = useState(false)
    const artistRef = useRef(null)
    const titleRef = useRef(null)

    const handleConfirmClick = async () => {
        if (inputStep === 2 || (inputType === 'artist' && inputStep === 1)) {
            setInputStep(inputStep+1)
            setLoading(true)
            await handleInputDisplaySearch()
            setLoading(false)
        }

        if (inputStep === 1) {
            setInputStep(inputStep+1)
            focusTitleRef()
        }
        
    }

    const handleResetClick = () => {
        focusArtistRef()
        clearInputSearch()
        setMountKey(prev => prev+1)
    }



    const focusTitleRef = () => {
        if (titleRef.current) {
            titleRef.current.focus()
        }
    }

    const focusArtistRef = () => {
        if (artistRef.current) {
            artistRef.current.focus()
        }
    }

    useEffect(() => {
        focusArtistRef()
        focusTitleRef()
    }, [inputStep])


    return (
        <>
            <div className="input-type-inputs">
                <div className="input-select-container">

                    <AnimatePresence>
                        {inputStep > 1 &&
                            <Input_Reset_Button handleReset={handleResetClick}
                            disabled={loading} />
                        }
                    </AnimatePresence>

                    <div className='input-select'>
                        <motion.p layout>similar to this
                            <span>
                                <select name="input-type"
                                id="input-type"
                                className="form-select"
                                value={inputType}
                                onChange={(e) =>{
                                    handleInputTypeSelect(e)
                                    focusArtistRef()}}
                                disabled={inputStep > 1}>
                                    <option value="track">song</option>
                                    <option value="album">album</option>
                                    <option value="artist">artist</option>
                                </select>
                            </span>
                        </motion.p>
                    </div>
                </div>

                <Input_Search
                inputType={'artist'}
                inputArtist={inputArtist}
                inputTitle={inputTitle}
                handleInputSearchChange={handleInputSearchChange}
                inputStep={inputStep}
                handleConfirmClick={handleConfirmClick}
                enabled={inputStep === 1}
                ref={artistRef}
                />
                
                <AnimatePresence>
                    {inputType != 'artist' &&
                    (<Input_Search
                    inputType={inputType}
                    inputArtist={inputArtist}
                    inputTitle={inputTitle}
                    handleInputSearchChange={handleInputSearchChange}
                    inputStep={inputStep}
                    handleConfirmClick={handleConfirmClick}
                    enabled = {inputStep ===  2}
                    ref={titleRef}
                    />)
                    }
                </AnimatePresence>
            </div>
            

            {((inputStep === 3) || (inputType === 'artist' && inputStep === 2)) &&
                <Input_Search_Display 
                displayData={displayData}
                loading={loading}
                type={inputType}/> 
            }
        </>
    )
}