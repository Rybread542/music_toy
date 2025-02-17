import { Input_Type } from "./input_type"


export function Input_Form() {
    

    return (
        <div className="input-form-container">
            <div className="input-form">
                <div className="input-form-choose-output-type">
                    <p>I'm looking for 
                        <span>
                            <select name="output-type" id="output-type">
                                <option value="songs">Songs</option>
                                <option value="albums">Albums</option>
                                <option value="artists">Artists</option>
                            </select>
                        </span>
                    </p>
                </div>

                <div className="input-form-choose-input-type">
                    <p>similar to this
                        <span>
                            <select name="input-type" id="input-type">
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
                        <Input_Type type={'album'}/>
                    </div>
                </div>

                <div className="input-form-addtl-comment">

                </div>

            </div>


        </div>
    )
}