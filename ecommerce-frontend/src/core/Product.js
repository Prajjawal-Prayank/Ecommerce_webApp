import React,{useState,useEffect} from 'react';
import {Redirect} from 'react-router-dom';
import Layout from './Layout';
import {read,listRelated} from './apiCore';
import Card from './Card';
import ShowImage from './ShowImage';
import {addItem} from './cartHelpers';
import moment from 'moment';
import '../styles.css';


const Product=(props)=>{

    const [product,setProduct]=useState({});
    const [error,setError]=useState(false);
    const [relatedProduct,setRelatedProduct]=useState([]);
    const [currentURL,setURL]=useState('');
    const [redirect,setRedirect]=useState(false);

    const loadSingleProduct=productId=>{
        read(productId)
        .then(data=>{
            if(data.error){
                setError(data.error);
            }else{
                setProduct(data);
                //fetching the related products (based on category)
                listRelated(data._id)
                    .then(products=>{
                        if(products.error){
                            setError(products.error);
                        }else{
                            setRelatedProduct(products);
                        }
                    })
            }
        });
    };

   

    useEffect(()=>{
        const productId=props.match.params.productId;   //props object is provided by react-router-dom
            //we are extracting productId FROM URL at the time the Product component is mounted. This 
            //is because we want to display all the info as soon as the page loads.
        loadSingleProduct(productId); 
    },[props]);     //specifyin "props" here means that whenever there is a change in props object
                    //useEffect will run again.This helps in rendering the next item in related proucts.

                    
    const addToCart=()=>{ 
        addItem(product,()=>{
            setRedirect(true); 
        });
    };
            
    const shouldRedirect=redirect=>{
        if(redirect){
            return <Redirect to="/cart" />
        }
    }

    const showAddToCartButton=quantity=>{
        return quantity>0 ?(
            <button onClick={addToCart} className="btn btn-outline-warning mt-2 mb-2">
                Add to Cart
            </button>
        ):(
            <button className="btn btn-outline-warning mt-2 mb-2" disabled>
                Add to Cart
            </button>
        )
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

    const showRelatedProductsHeader=()=>{
    return   relatedProduct.length>0 ?  (<div className="mt-4">
                                    <h2>Related Products</h2>
                                </div> ) :(
                                    <div></div>
                                )
    }


    return (
    <div style={{backgroundImage: "linear-gradient(rgba(0,0,0,0.1),rgba(0,0,0,0.1))"}}>
        <Layout title={product && product.name} 
            description={product && product.category && product.category.name} className="container-fluid" >
            
            <div className="row" >
                <div className="col-4 mt-10">
                    <ShowImage item={product} url="product" />
                </div>
                {shouldRedirect(redirect)}
                <div className="col-6 " 
                    style={{margin:"30px",whiteSpace:"pre-wrap",
                               marginRight:"40" }}>
                        <h2>Description</h2>
                        <p className="lead">
                            {(product.description) }
                        </p>
                        <div>
                            <h6 style={{display:"inline-block"}}>Price :  </h6> 
                            <h5 style={{display:"inline-block"}}>{"Rs "+product.price}</h5  >
                        </div>
                        <div>
                            Added {moment(product.createdAt).fromNow()}...
                        </div>
                        <p>
                            {showStock(product.quantity)}
                        </p>
                        <p>
                            {showAddToCartButton(product.quantity)}
                        </p>                    
                </div>
            </div>
            {showRelatedProductsHeader()}  
            
            <div className="container-fluid testimonial-group" >
            <div className="row text-center flex-nowrap" >
                
                    {relatedProduct && relatedProduct.map((product,i)=>(
                        <Card key={i} className="col-sm-4" product={product} myStyle={{backgroundImage:"none"}} />
                    ))}
                
            </div>      
            </div>                               
        </Layout>  
    </div> 
    );
};

export default Product;