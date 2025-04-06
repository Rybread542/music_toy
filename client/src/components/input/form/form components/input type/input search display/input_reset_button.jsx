

export function Input_Reset_Button({handleReset}) {

    return (
        <button type="button" onClick={handleReset} 
        className={"input-reset-button"}>
            <i className="fa-solid fa-arrow-rotate-right"></i>
        </button>
    )
}   