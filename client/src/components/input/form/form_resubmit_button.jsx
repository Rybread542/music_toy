

export function Form_Resubmit_Button({handleResubmit}) {

    return (
        <div className="form-resubmit-button-container">
            <button type="button" onClick={handleResubmit}
            className={"form-resubmit-button"}>
                <i className="fa-solid fa-arrows-rotate"></i>
            </button>
        </div>
    )
}   