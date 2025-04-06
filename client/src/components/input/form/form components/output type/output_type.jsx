

export function Output_Type({handleOutputSelect, outputType}){

    return (
        <div className="output-select-container">
            <div className="output-select">
                <p>I'm looking for 
                    <span>
                        <select name="output-type" 
                        id="output-type" 
                        className="form-select"
                        value={outputType}
                        onChange={(e)=> handleOutputSelect(e)}>
                            <option value="track">songs</option>
                            <option value="album">albums</option>
                            <option value="artist">artists</option>
                        </select>
                    </span>
                </p>
            </div>
        </div>
    )
}