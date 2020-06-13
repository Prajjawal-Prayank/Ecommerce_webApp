import React,{useState} from 'react';
import { Redirect} from 'react-router-dom';
import Layout from '../core/Layout';
import {signin,aurhenticate,isAuthenticated} from '../auth';
    //since signin() is in "index.js" ,we don't specifically need to write that file's name. 

const Signin=()=> {
    const [values,setValues]=useState({
        email:"",
        password:"",
        error:"",
        loading:false,
        redirectToReferrer:false
    });

    const {email,password,loading,error,redirectToReferrer}=values;
    const {user}=isAuthenticated();
    //wherever we define variables like this, we are using it as a destructor.

    //higher order function
    const handleChange=name=>event=>{
        setValues({...values,error:false, [name]:event.target.value});  //... is aka rest operator
                                                                    //so it takes the rest of the values
    };

    

    const clickSubmit=(event)=>{
        event.preventDefault(); //this is done to prevent Default action on clicking button.
                                //The default action is that the page gets reloaded   
        setValues({...values,error:false,loading:true});
        signin({email,password})
            //since the key and value are same in name:name,email:email,password:password ,so
            //we write this way
            .then(data=>{ 
                if(data.error){
                    setValues({...values,password:'',error: data.error, loading:false,});
                }else{
                    aurhenticate(data,()=>{     //checks for info in LocalStorage
                        setValues({...values,
                            redirectToReferrer:true
                        });
                    })
                }
            });    
    };

    const signInForm=()=>(
        <form>
            <div className="form-group">
                <label className="text-muted">Email</label>
                <input onChange={handleChange('email')} type="email" className="form-control" value={email}/>
            </div>
            <div className="form-group">
                <label className="text-muted">Password</label>
                <input onChange={handleChange('password')} type="password" className="form-control" value={password}/>
            </div>
            <button onClick={clickSubmit} className="btn btn-primary">
                Submit
            </button>
        </form>
    );

    const showError=()=>(
        <div className="alert alert-danger" style={{display:error?'':'none'}}>
            {error}
        </div>
    );
    //curly braces were not used in this function. So, () is used.No return () statement.


    const showLoading=()=>(
        loading && (
            <div className="alert alert-info">
                <h2>Loading...</h2>
            </div>
        )
    );

    const redirectUser=()=>{
        if(redirectToReferrer){
            if(user && user.role===1){
                return <Redirect to='/admin/dashboard' />;
            }else{
                return <Redirect to='/user/dashboard' />;
            }
        }
        if(isAuthenticated()){
            return <Redirect to='/' />;
        }
    };

    return(     //curly braces were used in this function. So, return() is used.
        <Layout title='Signin' description='Signup to E-commerce App' 
        className="container col-md-6 offset-md-2">
            {showError()}
            {showLoading()}
            {signInForm()}
            {redirectUser()}
        </Layout>
    );
};


export default Signin;