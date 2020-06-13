import React,{useState,useEffect} from "react";
import Layout from '../core/Layout';
import {isAuthenticated} from '../auth';
import { Redirect} from 'react-router-dom';
import {read,update,updateUser} from './apiUser';

const Profile=({match})=>{    //helps in accessing contents of URL
    const [values,setValues]=useState({
        name:"",
        email:"",
        password:"",
        newPassword:"",
        confirmPassword:"",
        error:"",
        success:false
    }); 

    const {name,email,password,newPassword,success,error,confirmPassword}=values;
    const {token}=isAuthenticated();

    const init=(userId)=>{  
        read(userId,token)
            .then(data=>{
                if(data.error){
                    setValues({...values,error:true});
                }else{
                    setValues({...values,name:data.name,email:data.email});
                }
            });
    }; 

    useEffect(()=>{
        init(match.params.userId);
    },[]);


    const handleChange=name=>e=>{
        setValues({...values,error:false,[name]:e.target.value});   
    }

    const clickSubmit=e=>{
        e.preventDefault();
        update(match.params.userId,token,{name,email,password,newPassword,confirmPassword})
            .then(data=>{
                if(data.error){
                    setValues({...values,error:data.error,confirmPassword:""})
                }else{
                    //updating in localStorage
                    updateUser(data,()=>{
                        setValues({...values,name:data.name,email:data.email,success:true})
                    });
                }
            });
        };  
    

    const redirectUser=(success)=>{
        if(success){
            return <Redirect to="/user/dashboard" />
        }
    }

    const showError=()=>(
        <div className="alert alert-danger" style={{display:error?'':'none'}}>
            {error}
        </div>
    );

    const profileUpdate=(name,email)=>(
        <form>
            <div className="form-group">
                <label className="text-muted">Name</label>
                <input type="text" onChange={handleChange('name')} className="form-control" value={name}/>
            </div>
            <div className="form-group">
                <label className="text-muted">Email</label>
                <input type="email" onChange={handleChange('email')} className="form-control" value={email} disabled />
            </div>
            <div className="form-group">
                <label className="text-muted">Password</label>
                <input type="password" onChange={handleChange('password')} className="form-control" value={password} />
            </div>
            <div className="form-group">
                <label className="text-muted">New Password</label>
                <input type="password" onChange={handleChange('newPassword')} className="form-control" value={newPassword}/>
            </div>
            <div className="form-group">
                <label className="text-muted">Confirm New Password</label>
                <input type="password" onChange={handleChange('confirmPassword')} className="form-control" value={confirmPassword}/>
            </div>
            <button onClick={clickSubmit} className="btn btn-primary">Submit</button>
        </form>
    )

    return(
        <Layout title='Profile' description='Update your profile' className="container-fluid">
            <div className="mr-5 ml-5 pr-5 pl-5">
                <h2 className="mb-4">Profile Update</h2>
                {showError()}
                {profileUpdate(name,email)}
                {redirectUser(success)}
            </div>
        </Layout>
    );


};

export default Profile;