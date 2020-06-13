import React,{useState,useEffect} from 'react';
import {Link} from 'react-router-dom';
import Layout from './Layout';
import {getCart} from './cartHelpers';
import Card from './Card';
import Checkout from './Checkout';


const Cart=()=>{
    const [items,setItems]=useState([]);
    const [run, setRun] = useState(false);

    useEffect(()=>{
        setItems(getCart());
    },[run]);     //whenever there is a change in "items", useEffect() will run again

    const showMessage=()=>(
        items.length? (
            <div>
                <h2 >Your cart has {`${items.length}`} item(s)</h2>
                <hr/>
            </div> 
        ):  (
        <div>
            <h2>
                Your cart is empty.<br/>
            </h2> 
            <h3>Goto <Link to="/shop">Shop</Link> and enjoy shopping.</h3>
            </div>
        )
    );
    

    const showCheckout=()=>(
        <div className="mt-5">
                <h2>Cart Summary</h2>
                <hr/>
                <div className=" ml-5 mr-5 pl-5 pr-5">
                    <Checkout products={items} />
                </div>    
            </div>
    )

    return(
        <Layout title='Shopping Cart' 
            description='Manage all that you wish to buy . Happy Shopping :)' className="container-fluid">
            {showMessage()}
            <div className="row">
                {items && items.map((product,i)=>(
                        <Card  key={i} product={product} showAddToCart={false} cartUpdate={true} 
                            showRemoveProductButton={true} setRun={setRun} run={run}   />
                ))}           
            </div>
            <div className="mb-5">
                {items.length>0 ?showCheckout():""}
            </div>

        </Layout>
    )


};


export default Cart; 
