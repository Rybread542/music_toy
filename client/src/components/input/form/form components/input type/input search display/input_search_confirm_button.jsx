

export function Input_Search_Confirm_Button({handleConfirmClick, enabled}) {


    return (
        <button type="button" className="input-search-confirm-button"
         onClick={(e) => handleConfirmClick(e)}>
            <i className="fa-solid fa-check"></i>
        </button>
    )


}