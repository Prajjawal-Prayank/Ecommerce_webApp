//sayHi is just an example snippet. Not of significant use in actual project.
exports.sayHi= (req,res)=>{
    //res.json({msg:'hello there'});
    res.send("Welcome to localhost");
};

//actual code
const User=require('../models/user');
const {errorHandler}=require('../helpers/dbErrorHandler');
const jwt=require('jsonwebtoken');              //to generate signed token
const expressJwt=require('express-jwt');        //for authorization check(or, for validating)

exports.signup=(req,res)=>{
    const user=new User(req.body);
    user.save((err,user)=>{
        if(err)
            return res.status(400).json({
                err: errorHandler(err)      //whenever there is an error from the database(mongoose) end
                                            //we will use this errorHandler
            });
        user.salt=undefined;
        user.hashed_password=undefined;     
        res.json({user});                   //since the output needs to be stored in database
                                            //we don't need to write 'return'  
    });
};



exports.signin=(req,res)=>{
    //find user based on email
    const{email,password}=req.body;
    User.findOne({"email":email},(err,user)=>{
        //if user not found
        if(err||!user){
            return res.status(400).json({
                error: 'User with that email does not exist. Make sure you are signed up first.'
            });
        }
        //user found
        //authenticate user
        if(!user.authenticate(password)){
            return res.status(401).json({
                error: 'Email and password do not match'
            })
        }

        //generate signed token with user id and secret
        const token= jwt.sign({_id: user._id},process.env.JWT_SECRET);
        //save the token in cookie
        res.cookie('t',token,{expire: new Date()+9999});  //token is saved with the name 't'. 9999 sec.
        //response is returned with user and token (to frontend client)
        const {_id,name , email, role } = user;
        return res.json({token, user:{_id, email, name ,role} })
                    //since the data is to be returned back to user and not required to be stored in
                    //database in this step, we use "return"
    });
};



exports.signout=(req,res)=>{
    res.clearCookie('t');
    res.json({message:'Signout sucessful'});
};


exports.requireSignin=expressJwt({                   //will be used as middleware to protect any routes
    secret: process.env.JWT_SECRET,
    userProperty:"auth"
});



exports.isAuth=(req,res,next)=>{                    //"next" is also used here because this is a middleware
    let user=req.profile && req.auth && req.profile._id==req.auth._id;
            //if the id of logged in user(req.auth) and the current user(req.profile) are same,
            //then only allow the access else deny access (as both are different users).
    if(!user){
        return res.status(403).json({
            error:"Unauthorized access. Access denied"
        });
    }
    next();
}


exports.isAdmin=(req,res,next)=>{
    if(req.profile.role===0){
        return res.status(403).json({
            error: "User not Admin. Sign in with Admin account to access the content"
        });
    }
    next();
}