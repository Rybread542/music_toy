import spinner from '../../assets/spin.svg'

export function Load_Spinner({width, height, opacity}) {

    return (
        <div className="load-spinner-container">
            <div className="load-spinner-size" style={{width, height, opacity}}>
                <img src={spinner} alt="spin" />
            </div>
        </div>
    )
}