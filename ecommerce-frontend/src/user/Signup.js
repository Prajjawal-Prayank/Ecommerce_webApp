import React,{useState} from 'react';
import {Link} from 'react-router-dom';
import Layout from '../core/Layout';
import {signup} from '../auth';
    //since signup() is in "index.js" ,we don't specifically need to write that file's name. 

const Signup=()=> {
    const [values,setValues]=useState({
        name:"",
        email:"",
        password:"",
        confirmPassword:"",
        error:"",
        success:false
    });

    const {name,email,password,success,error,confirmPassword}=values;

    //higher order function
    const handleChange=name=>event=>{
        setValues({...values,error:false, [name]:event.target.value});  
            //ALERT!- square bracket is used in name..and curly braces overall
    };

    

    const clickSubmit=(event)=>{
        event.preventDefault(); //this is done to prevent Default action on clicking button.
                                //The default action is that the page gets reloaded   
        setValues({...values,error:false});
        signup({name,email,password,confirmPassword})
            //since the key and value are same in name:name,email:email,password:password ,so
            //we write this way
            .then(data=>{ 
                if(data.error){
                    setValues({...values,error: data.error,confirmPassword:'', success:false});
                }else{
                    setValues({...values,
                            name:'',
                            email:'',
                            password:'',
                            confirmPassword:'',
                            error:'',
                            success:true
                    });
                }
            });    
    };

    const signUpForm=()=>(
        <form>
            <div className="form-group">
                <label className="text-muted">Name</label>
                <input onChange={handleChange('name')} type="text" className="form-control" value={name} />
            </div>
            <div className="form-group">
                <label className="text-muted">Email</label>
                <input onChange={handleChange('email')} type="email" className="form-control" value={email}/>
            </div>
            <div className="form-group">
                <label className="text-muted">Password</label>
                <input onChange={handleChange('password')} type="password" className="form-control" value={password}/>
            </div>
            <div className="form-group">
                <label className="text-muted">Confirm Password</label>
                <input onChange={handleChange('confirmPassword')} type="password" className="form-control" value={confirmPassword}/>
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


    const showSuccess=()=>(
        <div className="alert alert-info" style={{display:success?'':'none'}}>
            Account successfully created. 
            Please <Link to='/signin'>Signin</Link>  to continue.
        </div>
    );

    return(     //curly braces were used in this function. So, return() is used.
        <Layout title='Signup' description='Signup to E-commerce App' 
        className="container col-md-6 offset-md-2">
            {showError()}
            {showSuccess()}
            {signUpForm()}
        </Layout>
    );
};


export default Signup;