const mongoose=require('mongoose'); 
const {ObjectId} = mongoose.Schema;

const productSchema=new mongoose.Schema({
    name:{
        type: String,
        trim: true,
        required: true,
        maxlength: 32
    },
    description:{
        type: String,
        required: true,
        maxlength: 2500
    },
    price:{
        type: Number,
        required: true,
        maxlength: 32
    },
    category:{
        type: ObjectId,
        ref: 'Category',                    //refers to the "Category" model
        required: true
    },
    quantity:{
        type: Number
    },
    sold:{
        type: Number,
        default:0
    },
    photo:{
        data: Buffer,
        contentType: String
    },
    shipping:{
        required: false,
        type: Boolean
    }

},
    {timestamps:true}                       //provides with 2 important info. fields
                                            // (i)created_at (ii)updated_at
);



module.exports=mongoose.model("Product",productSchema);
        