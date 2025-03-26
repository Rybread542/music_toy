

export function Next_Back_Button({handleClickNext, handleClickBack, direction}) {


    return (
        <div className={direction + "-button"} onClick={direction === 'next' ? handleClickNext : handleClickBack}>
            <p>{direction === 'next' ? '->' : '<-'}</p>
        </div>
    )

}