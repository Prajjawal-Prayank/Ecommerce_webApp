import React,{useState} from 'react';

const RadioBox=({prices,handleFilters})=>{
    const [value,setValue]=useState({});

    const handleChange=(event)=>{
        handleFilters(event.target.value); //basically, on change, this is sent to parent component for evaluation
        setValue(event.target.value);
    };

    return prices.map((p,i)=>(
        <div key={i} >
            <input onChange={handleChange} id={i}
                value={`${p._id}`} 
                //value={p._id}
                name={p}            //this ensures that only one radioButton is selected
                type="radio" className="mr-2 ml-4" 
            />         
            <label className="form-check-label">{p.name}</label> 
        </div>
    ));
};

export default RadioBox;