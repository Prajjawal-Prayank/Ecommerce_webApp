import React,{useState,useEffect} from "react";
import Layout from '../core/Layout';
import {isAuthenticated} from '../auth';
import {Redirect} from 'react-router-dom';
import {getProduct,getCategories,updateProduct} from './apiAdmin';

const UpdateProduct=({match})=>{

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
        error:false,
        createdProduct:'',
        redirectToProfile: false,
        formData:new FormData()     //we will send this to the backend
    });

    const {name,description,price,category,shipping,categories,quantity,loading,error,createdProduct,
        redirectToProfile,formData} = values;   
        
    const init=productId=>{
        getProduct(productId)
            .then(data=>{   
                if(data.error){
                    setValues({...values,error:data.error});
                }else{
                    //here we will populate the state and load categories
                    setValues({...values,
                        name:data.name,
                        description:data.description,
                        price:data.price,
                        quantity:data.quantity,
                        //category:data.category._id,
                        shipping:data.shipping,
                        formData:new FormData()
                    });
                    initCategories();
                }
            })
    }    


    //load categories and set form data
    const initCategories=()=>{
        getCategories()
        .then(data=>{
            if(data.error){
                setValues({...values,error: data.error})
            }else{ 
                setValues({categories:data,formData:new FormData()});   
            }
        })
    };


    useEffect(()=>{
        init(match.params.productId);
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
        updateProduct(match.params.productId,user._id,token,formData)
        .then(data=>{
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
                    //category:'',
                    error:false,
                    createdProduct: data.name,
                    redirectToProfile:true
                });
                //document.getElementById("all_cat").selectedIndex = "0";
                //  document.getElementById("ship_status").selectedIndex = "0";
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
            <button className="btn btn-outline-primary">Update Product</button>
        </form>
    )    

    const showError=()=>(
        <div className="alert alert-danger" style={{display:error?'' : 'none'}}>
            {error}
        </div>
    );

    const showSuccess=()=>(
        <div className="alert alert-info" style={{display:createdProduct?'' : 'none'}}>
            <h2>Product "{ `${createdProduct} ` }" is updated!</h2>
        </div>
    );

    const showLoading=()=>(
        loading && <div className="alert alert-success">
            <h2>Loading...</h2>
        </div>
    )

    const redirectUser=()=>{
        if(redirectToProfile){
            if(!error){
                window.alert('Product was successfully updated.')
                return <Redirect to="/admin/products" />
            }
        }
    }

    return (
        <Layout title="Add a new Product" description={`Welcome ${user.name}!`} >
            <div className="row">
                <div className="col-md-8 offset-md-2"> 
                    {showLoading()} 
                    {showSuccess()} 
                    {showError()}
                    {newProductForm()}  
                    {redirectUser()}                  
                </div>
            </div>
        </Layout>
    )
}


export default UpdateProduct;