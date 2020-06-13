const User=require('../models/user');
const {Order}=require('../models/order');
const mongoose=require('mongoose');
const { errorHandler } = require('../helpers/dbErrorHandler');

exports.userById=(req,res,next,id)=>{   
    User.findById(id).exec((err,user)=>{
        if(err || !user){
            return res.status(400).json({
                error: "User not found"
            });    
        }
        req.profile=user;       //if user is found, then popuate the request object with the user details
        next();
    });
};

exports.read=(req,res)=>{
    req.profile.salt=undefined;     //hiding salt
    req.profile.hashed_password=undefined;  //hiding password
    return res.json(req.profile);
}


exports.update=(req,res)=>{
    mongoose.set('useFindAndModify', false);   
    var body=req.body;
    var obj={name:body.name};    
    if(body.newPassword!=='')
        obj.hashed_password=body.hashed_password;
    User.findOneAndUpdate({_id:req.profile._id},{$set: obj},{new:true},(err,user)=>{
        if(err){
            return res.status(400).json({
                err: "Unauthorized user"
            });
        }
        user.salt=undefined;
        user.hashed_password=undefined;
        res.json(user); 
    });
            //the updated info comes in req.body 
            //searching is done on id
            //{new:true} -> sends newly updated json to frontend as response
};


exports.addOrderToUserHistory=(req,res,next)=>{
    let history=[];

    req.body.order.products.map((item)=>{
        history.push({
            _id:item._id,
            name:item.name,
            description:item.description,
            category:item.category,
            quantity: item.count,
            transaction_Id: req.body.order.transaction_Id,
            amount: req.body.order.amount,
        })
    });

    //alert of syntax
    //here, $push is used instead of $set (since we need to append in the history array)
    //{new:true} is used so that updated object is returned. If not used,we will receive the old object
    //as response
    User.findOneAndUpdate({_id:req.profile._id} , {$push:{history:history}},{new:true})
    .exec()
    .then((data,err)=>{ 
            if(err){
                return res.status(400).json({
                    error: 'Error in updating purchase history of user'
                });
            }
            next();
        });  
};


exports.purchaseHistory=(req,res)=>{
    Order.find({user:req.profile._id})  //find all aorders done by this user
        .populate('user','_id name')
        .sort('-created')
        .exec((err,orders)=>{
            if(err){
                return res.status(400).json({
                    error: errorHandler(err)
                });
            }
            res.json(orders);
        });
};