import { Input_Type } from "./input_type"
import { use, useState } from "react"


export function Input_Form({handleFormSubmit, setCurrentFormData}) {
    
    const [ inputType, setInputType ] = useState('song')
    const [ outputType, setOutputType ] = useState('song')
    const [ inputArtist, setInputArtist ] = useState('')
    const [ inputTitle, setInputTitle ] = useState('')
    const [ link, setLink ] = useState('')
    const [ inputComment, setInputComment ] = useState('')


    const handleInputSelect = (e) => {
        setInputType(e.target.value)
    }
    
    const handleOutputSelect = (e) => {
        setOutputType(e.target.value)
    }

    const handleLocalSubmit = async(e) =>  {
        e.preventDefault()
        const inputData = {
            inputType,
            outputType,
            inputArtist,
            inputTitle,
            inputComment
        }

        setCurrentFormData(inputData)
        await handleFormSubmit(inputData)
        
    }
    


    return (
        <div className="input-form-container">
            <div className="input-form">
                <form onSubmit={handleLocalSubmit}>
                    <div className="input-form-choose-output-type">
                        <p>I'm looking for
                            <span>
                                <select name="output-type" id="output-type" onChange={handleOutputSelect}>
                                    <option value="songs">Songs</option>
                                    <option value="album">Albums</option>
                                    <option value="artist">Artists</option>
                                </select>
                            </span>
                        </p>
                    </div>

                    <div className="input-form-choose-input-type">
                        <p>similar to this
                            <span>
                                <select name="input-type" id="input-type" onChange={handleInputSelect}>
                                    <option value="song">Song</option>
                                    <option value="album">Album</option>
                                    <option value="artist">Artist</option>
                                    <option value="playlist">Playlist</option>
                                </select>
                            </span>
                        </p>
                    </div>

                    <div className="input-form-type-details-container">
                        <div className="input-form-type-details">
                            <Input_Type type={inputType} setArtist={setInputArtist} setTitle={setInputTitle} setLink={setLink}/>
                        </div>
                    </div>

                    <div className="input-form-addtl-comment">
                        <input type="text" placeholder="Additional prompts for the AI" onChange={(e) => setInputComment(e.target.value)}/>
                    </div>
                    
                    <input type="submit" value={'GO!'}/>

                </form>

            </div>

        </div>
    )
}