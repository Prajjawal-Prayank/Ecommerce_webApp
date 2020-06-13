const express=require('express');            //importing express 
const mongoose=require('mongoose');          //importing mongoose
const morgan=require('morgan');             
const bodyParser=require('body-parser');
const cookieParser=require('cookie-parser');
const cors=require('cors');
const expressValidator=require('express-validator');
require('dotenv').config();                  //allows us to use env variables here
                        //format :- process.env.var ("var" is the name of variable as used in .env file)

//importing routes
const authRoutes=require('./routes/auth');
const userRoutes=require('./routes/user');
const categoryRoutes=require('./routes/category');
const productRoutes=require('./routes/product');
const braintreeRoutes=require('./routes/braintree');
const orderRoutes=require('./routes/order');

//express
const app=express();
//for using in heroku
const path = require('path');
app.use('/', express.static(path.join(__dirname, '/client/build')));

//db    
//for connecting to local database, use :- process.env.DATABASE
//for now..test database is connected. We need to connect to E-commerce
mongoose.connect(process.env.ATLAS_DATABASE,{
    useNewUrlParser: true,  //avoids deprecation warning of connect(). The MongoDB Node.js driver rewrote the 
                            //tool it uses to parse MongoDB connection strings. Because this is such a big 
                            //change, they put the new connection string parser behind a flag. 

    useUnifiedTopology: true, //avoids deprecation warning of connect(). this property is used to
                              //opt in to using the new topology engine
                                
    useCreateIndex: true,
    useFindAndModify: false     //avoids deprecation warning of findOneAndUpdate() and some other fun()
}).then( () => console.log("Database Connected"))
.catch(err => console.log("Error in database connection"));


/*
app.get('/', (req,res)=>{                   // get() is a function provided in express
    res.send("hello!");
});
*/


//middlewares
app.use(morgan('dev'));                     //"dev"->Concise output colored by response status for development use
app.use(bodyParser.json());                 //ensures that we get json data from request body
app.use(cookieParser());
app.use(expressValidator());
app.use(cors());                            //helps in communicating b/w requests over different ports


//routes middleware
app.use('/api', authRoutes);                //all the routes mentioned in authRoutes are mounted on '/api'
app.use('/api',userRoutes); 
app.use('/api',categoryRoutes);  
app.use('/api',productRoutes);
app.use('/api',braintreeRoutes); 
app.use('/api',orderRoutes);

const port=process.env.PORT || 8000         //8000 is just to make sure that app runs on this port if 
                                            //.env is not available/accessible for some reason
                                            

app.listen(port,()=>{
    console.log(`Server running on port ${port}`);
});                                            
                                         
                                            