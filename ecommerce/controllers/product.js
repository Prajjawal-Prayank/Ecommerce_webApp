const Product=require('../models/product');
const formidable=require('formidable');
const _=require('lodash');
const fs=require('fs')                              //for accessing file-system
const {errorHandler}=require('../helpers/dbErrorHandler');


exports.productById=(req,res,next,id)=>{
    Product.findById(id)
    .populate('category')
    .exec((err,product)=>{
        if(err || !product){
            return res.status(400).json({
                error: "Product not found" 
            });
        }
        req.product=product;
        next();
    })
}

exports.read=(req,res)=>{
    req.product.photo=undefined;
    return res.json(req.product);
}


exports.create=(req,res)=>{
    let form=new formidable.IncomingForm();         //extracts all the info from the form
    form.keepExtensions=true;                       //keepExtensions of the files
    form.parse(req,(err,fields,files)=>{
        if(err){
            return res.status(400).json({
                error:'Image could not be uploaded'
            });
        }

        //checking the presence of all the fields
        const {name,description,price,category,quantity,shipping}=fields;
        if(!name||!description||!price||!category||!quantity||!shipping)
        {
            return  res.status(400).json({
                error:"Fill in all the fields to proceed"
            });
        }


        let product=new Product(fields);
        if(files.photo){
            if(files.photo.size>(3*1024*1024)){
                return  res.status(400).json({
                    error:"Image should be of less than 3MB in size"
                });
            }
            product.photo.data=fs.readFileSync(files.photo.path);
            product.photo.contentType= files.photo.type;
        }
        product.save((err,result)=>{
            if(err){   
                return res.status(400).json({
                    error: errorHandler(err)
                });
            }
            res.json({result});
        });
    });
};

exports.remove=(req,res)=>{
    let product=req.product;
    product.remove((err,deletedProduct)=>{
        if(err){
            return res.status(400).json({
                error: errorHandler(err)
            });
        }
        res.json({
            message:"Product deleted successfully"
        });
    });
};


exports.update=(req,res)=>{
    let form=new formidable.IncomingForm();         //extracts all the info from the form
    form.keepExtensions=true;                       //keepExtensions of the files
    form.parse(req,(err,fields,files)=>{
        if(err){
            return res.status(400).json({
                error:'Image could not be uploaded'
            });
        }


        let product=req.product;
        product=_.extend(product,fields);   //extend() is provided by lodash. 1st arg->obj. to be updated
                                            //2nd arg->object with updated values/fields
        if(files.photo){
            if(files.photo.size>(3*1024*1024)){
                return  res.status(400).json({
                    error:"Image should be of less than 3MB in size"
                });
            }
            product.photo.data=fs.readFileSync(files.photo.path);
            product.photo.contentType= files.photo.type;
        }
        product.save((err,result)=>{
            if(err){
                return res.status(400).json({
                    error: errorHandler(err)
                });
            }
            res.json({result});
        });
    });
};



/*
sell / arrival
by sell = /products?sortBy=sold&order=desc&limit=4
by arrival=/products?sortBy=createdAt&order=desc&limit=4
if no params are sent,then all products are returned
*/

exports.list=(req,res)=>{ 
    //query-string module is used to send data from frontend to backend
    //so, the parameters of search are stored in req.query
    //we send these parameters from frontend in our URL
    //different parameters are joined by & 
    //e.g-> /api/products?category=5eda196f5a1a153b7c153e45&search=ss
    let order=req.query.order ? req.query.order : 'asc';
    let sortBy=req.query.sortBy ? req.query.sortBy : '_id';
    let limit=req.query.limit ? parseInt(req.query.limit) : 10;
    

    Product.find()
            .select("-photo")                   //deselecting photo
            .populate('category')               //populating the category field
            .sort([[sortBy,order]])
            .limit(limit)
            .exec((err,products)=>{
                if(err){
                    return res.status(400).json({
                        error: "Product not found"
                    });
                }
                res.json(products);
            });
};  


exports.listRelated=(req,res)=>{
    let limit=req.query.limit ? parseInt(req.query.limit) : 10;

    Product.find({_id:{$ne:req.product}, category:req.product.category})
        //find all the products with same category (avoid the current product)
        .limit(limit)
        .populate('category','_id name')        //only get _id and name fields
        .exec((err,products)=>{
            if(err){
                return res.status(400).json({
                    error: "Product not found"
                });
            }    
            res.json(products);
        });
};


exports.listCategories=(req,res)=>{
    Product.distinct("category",{},(err,categories)=>{
        if(err){
            return res.status(400).json({
                error: "Categories not found"
            });
        }    
        res.json(categories);
    });
};



exports.listBySearch = (req, res) => {
    let order = req.body.order ? req.body.order : "desc";
    let sortBy = req.body.sortBy ? req.body.sortBy : "_id";
    let limit = req.body.limit ? parseInt(req.body.limit) : 100;
    let skip = parseInt(req.body.skip);
    let findArgs = {};
 
    for (let key in req.body.filters) {
        if (req.body.filters[key].length > 0) {
            if (key === "price") {
                // gte -  greater than price [0-10]
                // lte - less than
                findArgs[key] = {
                    $gte: req.body.filters[key][0],
                    $lte: req.body.filters[key][1]
                };
            } else {
                findArgs[key] = req.body.filters[key];
            }
        }
    }
 
    Product.find(findArgs)
        .select("-photo")
        .populate("category")
        .sort([[sortBy, order]])
        .skip(skip)
        .limit(limit)
        .exec((err, data) => {
            if (err) {
                return res.status(400).json({
                    error: "Products not found"
                });
            }
            res.json({
                size: data.length,
                data
            });
        });
};


exports.photo=(req,res,next)=>{
    if(req.product.photo.data){
        res.set('Content-Type',req.product.photo.contentType);
        return res.send(req.product.photo.data);
    }
    next();
};


exports.listSearch=(req,res)=>{
    //query obj. will keep search-text and category selected in the frontend
    const query={}

    //if frontend sent a search text, add it to query 
    if(req.query.search){
        query.name={$regex:req.query.search , $options: 'i'} // i -> case-insensitive
                //all the products where this string is available, will be fetched
    
        //if frontend sent category as well, add it to query
        if(req.query.category && req.query.category!='All'){
            query.category=req.query.category;
        }

        //finding product based on 2 properties
        Product.find(query,(err,products)=>{
            if(err){
                return res.status(400).json({
                    error:errorHandler(err)
                });
            }
            res.json(products);
        }).select('-photo');
    }
        
};


//syntax alert
exports.updateProductQuantity=(req,res,next)=>{
    let bulkOps=req.body.order.products.map((item)=>{
        return {
            updateOne:{     //funtionality provided by mongoose
                filter:{_id: item._id},
                update:{$inc : {quantity: -item.count, sold: +item.count}}  //inc is for include
            }
        }
    });

    //bulkWrite() is provided by mongoose. First argument is array of objects
    Product.bulkWrite(bulkOps,{},(error,product)=>{
        if(error){
            return res.status(400).json({
                error:"Error in product quantity updation"
            });
        }
        next();
    } )
}