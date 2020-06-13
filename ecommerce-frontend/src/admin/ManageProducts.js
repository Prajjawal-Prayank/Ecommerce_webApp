import React,{useState,useEffect} from "react";
import Layout from '../core/Layout';
import {isAuthenticated} from '../auth';
import { Link} from 'react-router-dom';
import {getProducts,deleteProduct} from './apiAdmin';


const ManageProducts=()=>{

    const {user,token}=isAuthenticated();
    const [products,setProducts]=useState([]);

    const loadProducts=()=>{
        getProducts().then(data=>{
            if(data.error){
                console.log(data.error);
            }else{
                setProducts(data);
            }
        });
    };

    const delProduct=productId=>{   
        deleteProduct(productId,user._id,token)
            .then(data=>{
                if(data.error){
                    console.log(data.error);
                }else{
                    loadProducts();
                }
            })
    }

    useEffect(()=>{
        loadProducts();
    },[])

   

    return(
        <Layout title="Manage Products" description={`Welcome to produts inventory ${user.name}!`} 
            className="container-fluid "> <center>
            <div className="row ml-5 mr-5">
                <div className="col-10 ml-5">
                    <h2 className="text-center">{products.length} products in inventory</h2>
                    <hr />
                    <ul className="list-group">
                        {products.map((p,i)=>(
                            <li key={i} className="list-group-item d-flex justify-content-between align-items-center">
                                <b>{i+1+") "+p.name}</b> <div className="float-right">
                                <Link to={`/admin/product/update/${p._id}`}>    
                                    <button className="btn btn-outline-warning mr-4" >Update</button>
                                </Link>
                                <button onClick={()=> delProduct(p._id)} className="btn btn-outline-danger">Delete</button>                                                                
                                </div>
                            </li> 
                        ))}   
                    </ul>    
                </div>    
            </div>    
            </center>
        </Layout>
    );
};


export default ManageProducts;