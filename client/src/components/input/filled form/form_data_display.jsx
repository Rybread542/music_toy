import { useMemo } from "react"
import { Input_Reset_Button } from "../form/form components/input type/input search display/input_reset_button"


export function Form_Data_Display({formData, load, handleStartOver}) {

    const dateRange = () => {
        const dateStart = formData.dateRange[0] < 1940 ? 
        '<1940' : formData.dateRange[0]

        const dateEnd = formData.dateRange[1] > 2020 ? 
        '2020+' : formData.dateRange[0]

        if (dateStart === '<1940'  && dateEnd === '2020+') {
            return 'All'
        }

        else {
            return `${dateStart} - ${dateEnd}`
        }
    }

    const rangeLabel = useMemo(dateRange, [formData.dateRange])

    return (

        <div className="form-data-display-container">
            <div className="form-data-display">

                <div className="form-display-output-type">
                    <p>I'm looking for <span className="type-span">{(formData.outputType === 'track' ? 'song' : formData.outputType)+ 's'}</span></p>
                </div>

                <div className="form-display-input-type">
                    <p>similar to this <span className="type-span">{formData.inputType === 'track' ? 'song' : formData.inputType}</span></p>
                </div>

                <div className="form-display-input-info">

                    <div className="input-info-img">
                        <img src={formData.displayData.resultImg} alt="" />
                    </div>

                    {formData.inputType != 'artist' &&
                    <div className="input-info">
                        <strong><p>{formData.displayData.resultTitle}</p></strong>
                        <p>{formData.displayData.resultArtist}</p>
                        <p>{formData.displayData.resultYear}</p>
                    </div>}

                    {formData.inputType === 'artist' &&
                    <div className="input-info">
                        <strong>
                            <p id="result-display-artist">{formData.displayData.resultArtist}</p>
                        </strong>

                        {formData.displayData.resultGenres.length > 0 &&
                        formData.displayData.resultGenres.slice(0, 3).map((genre, index) => {
                            return <p key={index}>{genre}</p>
                        })}
                    </div>}

                </div>

                <div className="form-display-output-options">
                    <div className="form-display-option" id='date-range'>
                        <i className="fa-solid fa-calendar"></i>
                        <p>{rangeLabel}</p>
                    </div>

                    <div className="form-display-option" id='variety-val'>
                        <i className="fa-solid fa-clover"></i>
                        <p>{formData.popVal}</p>
                    </div>
                    {formData.comment && (
                        <div className="form-display-comment">
                            <p>{formData.comment}</p>
                        </div>
                    )}
                </div>

            </div>

            {!load &&
                <Input_Reset_Button handleReset={handleStartOver}/>
            }
        </div>
    )

}