import React,{useState} from "react";
import Layout from '../core/Layout';
import {isAuthenticated} from '../auth';
import { Link} from 'react-router-dom';
import {createCategory} from './apiAdmin';

const AddCategory=()=>{
    const [name,setName]=useState('');
    const [error,setError]=useState(false);
    const [success,setSuccess]=useState(false);

    //destructre user and info from localstorage
    const {user,token} = isAuthenticated();

    const handleChange=(e)=>{
        setError('');
        setSuccess('');
        setName(e.target.value);
    }

    const clickSubmit=(e)=>{
        e.preventDefault();
        setError('');
        setSuccess(false);
        //make request to api to create category
        createCategory(user._id,token,{name})
        .then(data=>{
            if(data.error){
                setSuccess('');
                setError(true);
            }else{
                setError('');
                setSuccess(true);
            }
        })
    };

    const newCategoryForm=()=>(
        <form onSubmit={clickSubmit}>
            <div className="form-group">
                <label className="text-muted">Name</label>
                <input type="text" className="form-control" 
                        onChange={handleChange} value={name} 
                        autoFocus required />                     
            </div>
            <button className="btn btn-outline-primary">Create Category</button>   
        </form>
    );

    const showSuccess=()=>{
        if(success){
            return <h3 className="text-success">Category "{name}" is created.</h3>
        }
    }


    const showError=()=>{
        if(error){
            return <h3 className="text-danger">Category "{name}" already exists!</h3>
        }
    }

    const goBack=()=>(
        <div className="mt-5">
            <Link to="/admin/dashboard" className="text-warning">
                &lt;- Go Back to Dashboard
            </Link>
        </div>
    );


    return (
        <Layout title="Add a new Category" description={`Welcome ${user.name}!`} >
            <div className="row">
                <div className="col-md-8 offset-md-2">   
                    {showSuccess()}
                    {showError()}
                    {newCategoryForm()} 
                    {goBack()}
                </div>
            </div>
        </Layout>
    )

};


export default AddCategory;