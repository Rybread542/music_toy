

export function Modal_Button({direction, handleButtonClick}) {


    return (
        <div className={direction + "-modal-button-container"}>
            <button type="button" onClick={handleButtonClick} className="modal-button">
                {direction === 'next' ? 
                (<i className="fa-solid fa-arrow-right-long"></i>)
                : 
                <i className="fa-solid fa-arrow-left-long"></i>}
            </button>
        </div>
    )

}