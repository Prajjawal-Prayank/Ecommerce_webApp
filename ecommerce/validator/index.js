const User=require('../models/user');

exports.userSignupValidator=(req,res,next)=>{
    req.check('name','Name is required').not().isEmpty();
    req.check('email','Email must be between 3 to 32 characters')
        .matches(/.+\@.+\..+/)
        .withMessage("Invalid email id.")
        .isLength({
            min: 4,
            max: 32
        });
    req.check('password','Password is required. ').not().isEmpty();
    req.check('password')
        .isLength({min:8})
        .withMessage('Password must contain atleast 8 characters')
        .matches(/\d/)
        .withMessage('Password must contain a number');

    
    const errors=req.validationErrors()
    if(errors){
        const firstError=errors.map(error=>error.msg)[0]; 
        return res.status(400).json({error:firstError});
    }  
    

    if(req.body.confirmPassword === req.body.password)
        next();
    else    
        return res.status(400).json({
            error:"Password and Confirm Password do not match"
        });


};


exports.userUpdateValidator=(req,res,next)=>{
    var body=req.body;
    if(body.password===''){
        return res.status(400).json({
            error:"Please fill password to update"
        });
    }else{
        User.findOne({"email":body.email},"hashed_password salt",(err,user)=>{
            if(!user.authenticate(body.password)){
                return res.status(401).json({
                    error: 'Wrong Password'
                })
            } else{
                
            if(body.newPassword!=='')
            {   
                req.check('newPassword')
                .isLength({min:8})
                .withMessage('New Password must contain atleast 8 characters')
                .matches(/\d/)
                .withMessage('New Password must contain a number');
            
                const errors=req.validationErrors()
                if(errors){
                    const firstError=errors.map(error=>error.msg)[0]; 
                    return res.status(400).json({error:firstError});
                }  
                

                if(body.confirmPassword === body.newPassword){
                    body.hashed_password=user.encryptPassword(body.confirmPassword);
                    next();
                }                    
                else    
                    return res.status(400).json({
                        error:"Password and Confirm Password do not match"
                    });
                

            }else
            next();
            }

        })
    }

    
}