import React from 'react';
import {API} from '../config';

const ShowImage=({item,url})=>(
    <div className="product-img mb-4" >
        <img src={`${API}/${url}/photo/${item._id}`} alt={item.name} className="mb-3"
            style={{ height:"auto",
                borderRadius:"10px",
                maxWidth:"100%",
                maxHeight:"100%",
                width: "auto\9"
            }} />
    </div>
);

export default ShowImage;
