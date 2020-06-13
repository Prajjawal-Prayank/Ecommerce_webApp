const { Order, CartItem }=require('../models/order');
const {errorHandler}=require('../helpers/dbErrorHandler');

//syntax alert!!
exports.orderById=(req,res,next,id)=>{  
    id=id.substring(1);   
    Order.findById(id)
        .populate('products.product','name price')   //each order has products property which holds array of products
            //so,to get all those products, we access like this.here, we only acces name & price of products
        .exec((err,order)=>{  
            if(err || !order){
                return res.status(400).json({
                    error: errorHandler(err)
                });
            }
            req.order=order; //making the order available in the req objext
            next();
        });   
};

exports.create=(req,res)=>{
    req.body.order.user=req.profile;       
    const order=new Order(req.body.order); 
    order.save((error,data)=>{
        if(error){
            return res.status(400).json({
                error: errorHandler(error)
            });
        }
        res.json(data);
    });
};

exports.listOrders=(req,res)=>{
    Order.find()
        .populate('user','_id name address')    //we populate the user field. We only extract the 3 mentioned feature here
        .sort('-created')
        .exec((err,orders)=>{
            if(err){
                return res.send(400).json({
                    error: errorHandler(err)
                });
            }
            res.json(orders);
        });
};


//syntax alert..!!
exports.getStatusValues=(req,res)=>{
    res.json(Order.schema.path("status").enumValues);
};



exports.updateOrderStatus=(req,res)=>{  
    Order.updateOne({_id: req.order._id},{$set:{status: req.body.status}},(err,order)=>{
        //we need to send orderId and status from frontend
        if(err){   
            return res.status(400).json({
                error: errorHandler(err)
            });
        }
        res.json(order);
    });
} ;