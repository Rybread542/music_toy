import { Cloudinary } from "@cloudinary/url-gen"
import {AdvancedImage, responsive, placeholder} from '@cloudinary/react';
import {thumbnail} from "@cloudinary/url-gen/actions/resize";
import { memo, useMemo } from "react";



function Optimized_Img({url, className, width, height}) {
    
    const image = useMemo(() => {
        const cloud = new Cloudinary({cloud: {cloudName: 'dny0sc5hz'}})

        if (!url.startsWith('http')) {
           return cloud.image(url)
           .resize(thumbnail().width(width).height(height))
           .format('auto')
           .quality('auto')
           .addFlag('progressive')
        }

        else {
            return cloud.image(url)
            .setDeliveryType('fetch')
            .resize(thumbnail().width(width).height(height))
            .format('auto')
            .quality('auto')
            .addFlag('progressive')
    }
        
        
    }, [url, width, height])
    

    return (
        <AdvancedImage className={className} cldImg={image}
        plugins={[
            placeholder({mode: 'predominant-color'}),
            responsive({steps: [width, width*2, width*3]})
        ]} 
        draggable={false}/>
    )
}

export const Memo_Image = memo(Optimized_Img)