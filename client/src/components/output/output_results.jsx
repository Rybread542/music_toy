import { Output_Result_Item } from "./output_result_item"


export function Output_Results({outputData, error}) {

    const imgUrl = (item) => {
        if (item.outputType === 'artist') {
            return item.artistPhoto ?
            item.artistPhoto 
            :
            'artist-photo-default.png'
        }

        else {
            return item.albumArt ? 
            item.albumArt 
            :
            'album-art-default.png'
        }
    }
    
    return (
        <div className="output-results-container">
            <div className="output-results">

                {error && (
                    <div className="error-container">
                        <p>{error}</p>
                    </div>
                )}

                {outputData?.map((item, index) => {
                    const img = imgUrl(item)
                    return <Output_Result_Item
                            item={item}
                            index={index}
                            img={img}
                            />
                })}
                
            </div>

        </div>
    )

}