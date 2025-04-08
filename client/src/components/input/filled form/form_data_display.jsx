import { useMemo } from "react"
import { Marquee_Text } from "../../misc/marquee_text"


export function Form_Data_Display({formData}) {

    const rangeLabel = useMemo(() => {
        const [ dateStart, dateEnd ] = formData.formData.dateRange
        const start = dateStart < 1940 ? '<1940' : dateStart
        const end = dateEnd > 2020 ? '2020+' : dateEnd
        return (start === '<1940' && end === '2020+') ? 'All' : `${start} - ${end}`
    }, [formData.formData.dateRange])

    return (

        <div className="form-data-display-container">
            <div className="form-data-display">

                <div className="form-display-output-type">
                    <p>I'm looking for <span className="type-span">{(formData.formData.outputType === 'track' ? 'song' : formData.formData.outputType)+ 's'}</span></p>
                </div>

                <div className="form-display-input-type">
                    <p>similar to this <span className="type-span">{formData.formData.inputType === 'track' ? 'song' : formData.formData.inputType}</span></p>
                </div>

                <div className="form-display-input-info">

                    <div className="input-info-img">
                        <img src={formData.displayData.resultImg} alt="" />
                    </div>

                    {formData.inputType != 'artist' &&
                    <div className="input-info">
                        {formData.displayData.resultTitle.length > 20 ?
                        <Marquee_Text text={formData.displayData.resultTitle}
                        id={'input-info-display-title'}
                        bold={true}
                        maxWidth="7rem"/>
                        :
                        <p style={{fontWeight: 'bold'}} className='input-info-display-title'>{formData.displayData.resultTitle}</p>
                        }

                        <p className='input-info-display-artist'>{formData.displayData.resultArtist}</p>
                        <p className='input-info-display-year'>{formData.displayData.resultYear}</p>
                    </div>}

                    {formData.formData.inputType === 'artist' &&
                    <div className="input-info">

                        {formData.displayData.resultArtist.length > 10 ?
                        <Marquee_Text text={formData.displayData.resultArtist}
                        id={'input-info-display-artist'}
                        bold={true}/>
                        :
                        <p className="result-display-artist">{formData.displayData.resultArtist}</p>
                        }   

                        {formData.displayData.resultGenres.length > 0 &&
                        formData.displayData.resultGenres.slice(0, 3).map((genre, index) => {
                            return <p className="result-display-genre" key={index}>{genre}</p>
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
                        <p>{formData.formData.popVal}</p>
                    </div>
                    {formData.formData.comment && (
                        <div className="form-display-comment">
                            <p>{formData.formData.comment}</p>
                        </div>
                    )}
                </div>

            </div>

            
        </div>
    )

}