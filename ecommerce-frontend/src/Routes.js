import React from 'react';
import {BrowserRouter,Switch, Route} from 'react-router-dom';
        //BrowserRouter is a component which wraps rest of the application/routes. This will make props 
        //available to other nested components.We can have access to route parameters.
import Signup from './user/Signup';
import Signin from './user/Signin';      
import Home from './core/Home';    
import PrivateRoute from './auth/PrivateRoute';
import AdminRoute from './auth/AdminRoute';
import Dashboard from './user/UserDashboard';
import Profile from './user/Profile';
import AdminDashboard from './user/AdminDashboard';
import AddCategory from './admin/AddCategory';
import AddProduct from './admin/AddProduct';
import Orders from './admin/Orders';
import Shop from './core/Shop';
import Product from './core/Product'; 
import Cart from './core/Cart';
import ManageProducts from './admin/ManageProducts';
import UpdateProduct from './admin/UpdateProduct';


const Routes=() =>{         //if curly braces are used, we need to use return statement.
    return (
    <BrowserRouter>
        <Switch>
            <Route path="/" exact component={Home} />
            <Route path="/shop" exact component={Shop} />
            <Route path="/Signin" exact component={Signin} />
            <Route path="/Signup" exact component={Signup} />
            <PrivateRoute path='/user/dashboard' exact component={Dashboard} />
            <PrivateRoute path='/profile/:userId' exact component={Profile} />
            <AdminRoute path='/admin/dashboard' exact component={AdminDashboard} />
            <AdminRoute path='/create/category' exact component={AddCategory} />
            <AdminRoute path='/create/product' exact component={AddProduct} />
            <AdminRoute path='/admin/orders' exact component={Orders} />
            <AdminRoute path='/admin/product/update/:productId' exact component={UpdateProduct} />
            <AdminRoute path='/admin/products' exact component={ManageProducts} />
            <Route path="/product/:productId" exact component={Product} />
            <Route path="/cart" exact component={Cart} />
        </Switch>
    </BrowserRouter>
    );
};

export default Routes; 
    //the Routes component is returning the entire application