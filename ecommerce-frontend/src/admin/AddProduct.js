import React,{useState,useEffect} from "react";
import Layout from '../core/Layout';
import {isAuthenticated} from '../auth';
import {createProduct,getCategories} from './apiAdmin';

const AddProduct=()=>{

    const {user,token} = isAuthenticated();
    const [values,setValues]=useState({
        name:'',
        description:'',
        price:'',
        categories:[],
        category:'',
        shipping:'',
        quantity:'',
        photo:'',
        loading:false,
        error:'',
        createdProduct:'',
        redirectToProfile: false,
        //formData: ''    //we will send this to the backend
        formData:new FormData()
    });

    const {name,description,price,category,shipping,categories,quantity,loading,error,createdProduct,
        redirectToProfile,formData} = values;   
        
    //load categories and set form data
    const init=()=>{
        getCategories()
        .then(data=>{
            if(data.error){
                setValues({...values,error: data.error})
            }else{ 
                setValues({...values,categories:data,formData:new FormData()});   
            }
        })
    };


    useEffect(()=>{
        init();
    },[]);

    const handleChange=name=>event=>{
        const value= (name==='photo'? event.target.files[0] : event.target.value );
            //event.target.files[0]-> only first image is considered.In multiple uploads, we are only
            //considering the first image
        formData.set(name,value);
        setValues({...values,[name]:value});    
    };    


    const clickSubmit=(event)=>{
        event.preventDefault();
        setValues({...values,error:'',loading:true});
        createProduct(user._id,token,formData)
        .then(data=>{
            
            var result = Object.keys(data).map(function (key) { 
                return [Number(key), data[key]]; 
            });  

            if(data.error){
                setValues({...values,error:data.error});
            }else{
                setValues({...values,
                    name:'',
                    description:'',
                    price:'',
                    photo:'',
                    loading:false,
                    quantity:'',
                    category:'',
                    createdProduct: result[0][1].name
                });
                document.getElementById("all_cat").selectedIndex = "0";
                document.getElementById("ship_status").selectedIndex = "0";
            }
        });
    };

    

    const newProductForm=()=>(
        <form className="mb-3" onSubmit={clickSubmit}>
            <h4>Attach Photo</h4>
            <div className="form-group">
                <label className="btn btn-secondary"> 
                    <input onChange={handleChange('photo')}  type="file" name="photo" accept="image/*" />
                </label>
            </div>
            <div className="form-group">
                <label className="text-muted">Name</label>
                <input onChange={handleChange('name')} type="text" className="form-control" value={name} />                
            </div>
            <div className="form-group">
                <label className="text-muted">Description</label>
                <textarea onChange={handleChange('description')} className="form-control" 
                    value={description}  style={{whiteSpace: 'pre'}} />                
            </div>
            <div className="form-group">
                <label className="text-muted">Price</label>
                <input onChange={handleChange('price')} type="number" className="form-control" value={price} />                
            </div>
            <div className="form-group">
                <label className="text-muted">Category </label>
                <select onChange={handleChange('category')} className="form-control" id="all_cat">
                <option >Please Select</option>
                    {categories && categories.map((c,idx)=>(
                        <option key={idx} value={c._id}>{c.name}</option>))}
                </select>
            </div>
            <div className="form-group">
                <label className="text-muted">Shipping</label>
                <select onChange={handleChange('shipping')} className="form-control" id="ship_status">
                    <option>Please Select</option>
                    <option value="0">No</option>
                    <option value="1">Yes</option>
                </select>
            </div>
            <div className="form-group">
                <label className="text-muted">Quantity</label>
                <input onChange={handleChange('quantity')} type="number" className="form-control" value={quantity} />                
            </div>
            <button className="btn btn-outline-primary">Create Product</button>
        </form>
    )    

    const showError=()=>(
        <div className="alert alert-danger" style={{display:error?'' : 'none'}}>
            {error}
        </div>
    );

    const showSuccess=()=>(
        <div className="alert alert-info" style={{display:createdProduct?'' : 'none'}}>
            <h2>Product "{ `${createdProduct} ` }" is created!</h2>
        </div>
    );

    const showLoading=()=>(
        loading && <div className="alert alert-success">
            <h2>Loading...</h2>
        </div>
    )

    return (
        <Layout title="Add a new Product" description={`Welcome ${user.name}!`} >
            <div className="row">
                <div className="col-md-8 offset-md-2"> 
                    {showLoading()} 
                    {showSuccess()} 
                    {showError()}
                    {newProductForm()}                    
                </div>
            </div>
        </Layout>
    )
}


export default AddProduct;