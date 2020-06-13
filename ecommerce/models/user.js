const mongoose=require('mongoose'); 
const crypto=require('crypto');             //module to hash the password
//const uuidv1=require('uuid/dist/v1');            //used to generate unique strings
//import { v1 as uuidv1 } from 'uuid';
const { v1: uuidv1 } = require('uuid');


const userSchema=new mongoose.Schema({
    name:{
        type: String,
        trim: true,
        required: true,
        maxlength: 32
    },
    email:{
        type: String,
        trim: true,
        required: true,
        unique:true
    },
    hashed_password:{
        type: String,
        required: true
    },
    about:{
        type: String,
        trim: true
    },
    salt:String ,                            //used in generating hashed password
    role:{
        type:Number,                         //0 for user, 1 for admin
        default:0
    },
    history:{                                //basically it is purchase history of the user
        type:Array,
        default:[]
    }
},
    {timestamps:true}                       //provides with 2 important info. fields
                                            // (i)created_at (ii)updated_at
);




//virutal fields
userSchema.virtual('password')
.set(function(password){                    //the "password" in argument is what we get from client side
    this._password=password;                //the "_password" is local var
    this.salt=uuidv1();
    this.hashed_password=this.encryptPassword(password);
})
.get(function(){
    return this._password;
})


userSchema.methods={
    authenticate:function(text){  
        return this.encryptPassword(text)===this.hashed_password;
    },


    encryptPassword:function(password){ 
        if(!password)   return '';
        try{ 
                return  crypto.createHmac('sha1',this.salt)          //sha1 algo is used
                         .update(password)
                         .digest('hex');                        //hexadecimal encoding used               
        }catch(err){    
            return '';
        }
    }
};


module.exports=mongoose.model("User",userSchema);
        //The .model() function makes a copy of schema.
        //The first argument is the singular name of the collection your model is for. 
        //** Mongoose automatically looks for the plural, lowercased version of your model name. ** 
        //Thus, for the example above, the model User is for the "users" collection in the database.


        //this enables us to use the model "User" (which follows the userSchema )anywhere in the project