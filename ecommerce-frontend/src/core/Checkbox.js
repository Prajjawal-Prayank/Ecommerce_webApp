import React,{useState} from 'react';

const Checkbox=({categories,handleFilters})=>{
    const [checked,setChecked]=useState([]);

    const handleToggle = c =>()=>{
        const currentCategoryId = checked.indexOf(c);   //indexof() will return -1 if not found
        const newCheckedCategoryId=[...checked];
        //if this category was not already in checked category
        //add it
        if(currentCategoryId===-1){
            newCheckedCategoryId.push(c);
        }else{  //remove it
            newCheckedCategoryId.splice(currentCategoryId,1);
        }
        setChecked(newCheckedCategoryId);
        handleFilters(newCheckedCategoryId);    //basically, on toggle, this list is sent to parent component for evaluation
    };

    return categories.map((c,i)=>(
        <li key={i} className="list-unstyled">
            <input onChange={handleToggle(c._id)} //since handleToggle returns a func., so calling handleToggle() is valid as event handler
                value={checked.indexOf(c._id===-1)} 
                //value={c._id}
                type="checkbox" className="form-check-input" 
            />
            <label className="form-check-label">{c.name}</label>
        </li>
    ));
};


export default Checkbox;