const mongoose=require('mongoose'); 

const categorySchema=new mongoose.Schema({
    name:{
        type: String,
        trim: true,
        required: true,
        maxlength: 32,
        unique: true 
    },

},
    {timestamps:true}                       //provides with 2 important info. fields
                                            // (i)created_at (ii)updated_at
);



module.exports=mongoose.model("Category",categorySchema);
        