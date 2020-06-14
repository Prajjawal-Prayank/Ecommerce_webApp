import React, { useState } from 'react';
import {Link, Redirect} from 'react-router-dom';
import ShowImage from './ShowImage';
import {addItem,updateItem,removeItem} from './cartHelpers';


const Card=({showAddToCart=true,showRemoveProductButton=false,cartUpdate=false,
        run = undefined,setRun = f => f,product,
        myStyle={backgroundImage: "linear-gradient(rgba(0,0,0,0.1),rgba(0,0,0,0.1))"}})=>{

    const [redirect,setRedirect]=useState(false);
    const [count,setCount]=useState(product.count);

    const addToCart=()=>{ 
        addItem(product,()=>{
            setRedirect(true);  
        });
    };
 

    const showStock=quantity=>{
        return quantity>0 ? (
            quantity<5 ? (
                <span className="badge badge-warning badge-pill">Only {quantity} pieces left.Hurry..! Order Now.</span>
            ):(
                <span className="badge badge-primary badge-pill">In Stock</span>
            )
        ):(
            <span className="badge badge-danger badge-pill">Out of Stock</span>
        )
    };
    

    const handleChange=productId=>event=>{
        setRun(!run); 
        let val=event.target.value;
        let mx=product.quantity;
        if(val<1)
            setCount(1);
        else if(val>mx)
            setCount(product.mx);
        else    
            setCount(val);        
        //setCount(event.target.value<1 ? 1 : event.target.value);
        //setCount(event.target.value>product.quantity ? product.quantity : event.target.value);
        if(event.target.value>=1 && val<=mx){
            updateItem(productId,event.target.value);
        }
    }



    const handleKeyPress=()=>event=>{
        event.preventDefault();
    }

    const showCartUpdateOptions=cartUpdate=>{
        return cartUpdate && (
            <div className="input-group mb-3" >
                <div className="input-group-prepend">
                    <span className="input-group-text" style={{background:"#5c8a8a",color:"white"}}>
                        Adjust Quantity 
                    </span>
                </div>
                <input type="number" className="form-control" min="1" max={product.quantity} 
                        onKeyPress={handleKeyPress()}
                         value={count} onChange={handleChange(product._id)} />
            </div>
        )
    }
    
    const showAddToCartButton=(quantity)=>{
        return quantity>0 ?(
            <button onClick={addToCart} className="btn btn-outline-warning ml-2 ">
                Add to Cart
            </button>
        ):(
            <button className="btn btn-outline-warning ml-2" disabled>
                Add to Cart
            </button>
        )
    };
    
    const remove=()=>{
        removeItem(product._id);
        setRun(!run); 
    }

    const showRemoveButton=(showRemoveProductButton)=>{
        return showRemoveProductButton && (
            <button onClick={remove} className="btn btn-outline-danger ml-2 ">
                Remove Product
            </button>
        );
    };

    const pageTop=()=>{
        return window.scrollTo(0, 0);
    }
    

    const shouldRedirect=redirect=>{
        if(redirect){
            return <Redirect to="/cart" />
        }
    }


    return(
        <div className="col-4 mb-3 " >
            
            <div className="card d-flex" style={{position:"relative"}} >
                <div className="card-header" style={{background:"#002b80",color:"white"}}>
                    <b>{product.name}</b>
                </div>
                <div className="card-body " style={myStyle}>
                    {shouldRedirect(redirect)}
                <center>
                    <div className="d-flex" style={{width:"100%",height:"100%",maxWidth:"200px",maxHeight:"200px",minHeight:"200px",minWidth:"200px",position:"relative"}}>
                        <ShowImage item={product} url="product" /> 
                    </div>
                </center>    
                    <p >{product.description.substring(0,25)+"......."}</p>
                    <p>Rs {product.price}</p>
                    <p>{showStock(product.quantity)}</p> 
                    <Link to={`/product/${product._id}`}>
                        <button className="btn btn-outline-primary mt-2 mb-2" 
                                    onClick={pageTop}>
                            View Product
                        </button>
                    </Link> 
                    {showAddToCart && showAddToCartButton(product.quantity)} 
                    {showRemoveButton(showRemoveProductButton)}
                    {showCartUpdateOptions(cartUpdate)}
                </div>
            </div>
        </div>
    );
};

export default Card;