import { use, useState } from "react"
import { Live_Search_Input } from "./form inputs/live_search_input"
import { Next_Back_Button } from "./next_back_button"
import { motion } from 'motion/react'



export function Input_Form({handleFormSubmit, setCurrentFormData}) {
    
    const [ inputType, setInputType ] = useState('track')
    const [ outputType, setOutputType ] = useState('track')

    const [ inputArtist, setInputArtist ] = useState('')
    const [ inputTitle, setInputTitle ] = useState('')
    
    const [ link, setLink ] = useState('')
    const [ inputComment, setInputComment ] = useState('')


    const [ outputSelected, setOutputSelected ] = useState(true)
    const [ inputSelected, setInputSelected ] = useState(false)
    const [ optionSelected, setOptionSelected ] = useState(false)

    const [ outputFinished, setOutputFinished ] = useState(false)
    const [ inputFinished, setInputFinished ] = useState(false)
    const [ optionFinished, setOptionFinished ] = useState(false)

    
    const handleClickNext = () => {
        if (outputSelected) {
            setOutputSelected(false)
            setOutputFinished(true)
            setInputSelected(true)
        }

        if (inputSelected) {
            setInputSelected(false)
            setInputFinished(true)
            setOptionSelected(true)
        }
    }

    const handleClickBack = () => {
        if(optionSelected) {
            setOptionSelected(false)
            setInputFinished(false)
            setInputSelected(true)
        }

        if(inputSelected) {
            setInputSelected(false)
            setOutputFinished(false)
            setOutputSelected(true)
        }
    }


    const handleInputSelect = (e) => {
        setInputType(e.target.value)
        clearInputs()
    }
    
    const handleOutputSelect = (e) => {
        setOutputType(e.target.value)
    }

    const clearInputs = () => {
        console.log('cleared')
        setInputArtist('')
        setInputTitle('')
        setTitleSearchResults([])
        setArtistSearchResults([])
    }

    const handleLocalSubmit = async(e) =>  {
        e.preventDefault()
        setOptionFinished(true)
        setOptionSelected(false)
        const inputData = {
            inputType,
            outputType,
            inputArtist,
            inputTitle,
            inputComment
        }

        setCurrentFormData(inputData)
        // await handleFormSubmit(inputData)
        
    }
    

    return (
    <>
        {!optionFinished &&
        (<div className="modal-container">
        </div>)}
        <div className="input-form-container">
            <div className="input-form">
                <form onSubmit={handleLocalSubmit}>

                    {(outputSelected || outputFinished) && (
                        <div className={outputSelected ? 'modal-box' : 'form-output-select-container'} 
                            id='form-output-select-container'>

                        
                            <div className="form-output-select">
                                <p>I'm looking for
                                    <span>
                                        <select name="output-type" id="output-type" 
                                        onChange={handleOutputSelect}
                                        disabled={outputFinished}>
                                            <option value="track">Songs</option>
                                            <option value="album">Albums</option>
                                            <option value="artist">Artists</option>
                                        </select>
                                    </span>
                                </p>
                            </div>

                           {outputSelected && 
                           (<Next_Back_Button handleClickNext={handleClickNext} 
                            handleClickBack={handleClickBack} 
                            direction={'next'}/>)}
                    </div>
                    )}

                    {(inputSelected || inputFinished) && (
                    <div className={inputSelected ? 'modal-box' : 'input-select-container'} id='input-form-options'>
                        <div className='input-select'  id="input-select">
                            <p>similar to this
                                <span>
                                    <select name="input-type" 
                                    id="input-type" 
                                    onChange={handleInputSelect}
                                    disabled={inputFinished}>
                                        <option value="track">Song</option>
                                        <option value="album">Album</option>
                                        <option value="artist">Artist</option>
                                        {/* <option value="playlist">Playlist</option> */}
                                    </select>
                                </span>
                            </p>
                        </div>

                        <div className="input-form-type-details">

                           {!inputFinished && 
                            <Live_Search_Input inputType={'artist'} 
                            inputArtist={inputArtist}
                            inputTitle={inputTitle} 
                            setInputArtist={setInputArtist} 
                            setInputTitle={setInputTitle}
                            searchResults={artistSearchResults}
                            setSearchResults={setArtistSearchResults} />}

                            {(inputType != 'artist' && !inputFinished) &&
                            <Live_Search_Input 
                            inputType={inputType} 
                            inputArtist={inputArtist}
                            inputTitle={inputTitle} 
                            setInputArtist={setInputArtist} 
                            setInputTitle={setInputTitle}
                            searchResults={titleSearchResults}
                            setSearchResults={setTitleSearchResults} />}

                        </div>

                        {inputSelected && 
                           (
                           <>
                            <Next_Back_Button handleClickNext={handleClickNext} 
                            handleClickBack={handleClickBack} 
                            direction={'next'}/>

                            <Next_Back_Button handleClickNext={handleClickNext} 
                            handleClickBack={handleClickBack} 
                            direction={'back'}/>
                            </>)
                        }

                    </div>
                    )}

                    {(optionSelected || optionFinished) &&
                    (<div className={optionSelected ? 'modal-box' : 'option-select-container'}>
                        <div className="comment-input">
                            {optionFinished ? 
                            (<p>{inputComment}</p>)
                            :
                            (<textarea
                            id="comment"
                            placeholder="Additional prompts for the AI"
                            onChange={(e) => setInputComment(e.target.value)}
                            cols={30}
                            rows={4}
                            />)
                            }
                        </div>

                        {!optionFinished &&
                        <div className="submit-button">
                            <input id="submit-button" type="submit" value={'GO!'}/>
                        </div>}

                        {optionSelected && 
                           (<Next_Back_Button handleClickNext={handleClickNext} 
                            handleClickBack={handleClickBack} 
                            direction={'back'}/>)
                        }
                    </div>
                    )}
                    
                    

                </form>

            </div>

        </div>
    </>
    )
}