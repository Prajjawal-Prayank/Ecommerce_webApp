const express=require('express'); 
const router=express.Router();

/*
//two ways to use functions present in controller
//method 1  :- require() the file and then invoke any function using var.fun() (template/syntax)
const appController=require('../controllers/user');
router.get('/',appController.sayHi);
*/

//method 2:- require the function directly by writing it in curly braces
const {sayHi} = require('../controllers/auth');
router.get('/',sayHi);

const {signup,signin,signout,requireSignin} = require('../controllers/auth');
const {userSignupValidator}=require('../validator');
router.post('/signup',userSignupValidator,signup);
router.post('/signin',signin);
router.get('/signout',signout);

module.exports=router;