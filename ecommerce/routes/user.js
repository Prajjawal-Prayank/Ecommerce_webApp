const express=require('express'); 
const router=express.Router();

const {userById,read,update,purchaseHistory} = require('../controllers/user');
const {requireSignin,isAuth,isAdmin} = require('../controllers/auth');   
const {userUpdateValidator}=require('../validator');                               
router.get('/secret/:userId',requireSignin,isAuth,isAdmin,(req,res)=>{
    res.json({user:req.profile});
});


router.get('/user/:userId',requireSignin,isAuth,read);
router.put('/user/:userId',requireSignin,isAuth,userUpdateValidator,update);
router.get('/orders/by/user/:userId',requireSignin,isAuth,purchaseHistory)

router.param('userId',userById);   //anytime there is  parameter "userId" in route, userById will be invoked
                                  //it is used to make user info available in the req object
                                 //"userById" being a callback for param() will have 4 parameters.
/* e.g.->
Route path: /users/:userId/books/:bookId
Request URL: http://localhost:3000/users/34/books/8989
req.params: { "userId": "34", "bookId": "8989" }
*/                                  

module.exports=router;