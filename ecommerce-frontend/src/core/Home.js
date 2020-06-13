import React,{useState,useEffect} from 'react';
import Layout from './Layout';
import {getProducts} from './apiCore';
import Card from './Card';
import Search from './Search';

//since <Route component> is used to render Home component, so all route props 
//(match, location and history) are available to to Home component
const Home=()=>  {

    const [productsBySell,setproductsBySell]=useState([]);
    const [productsByArrival,setproductsByArrival]=useState([]);
    const [error,setError]=useState(false);

    const loadProductsBySell=()=>{
        getProducts('sold')
        .then(data=>{
            if(data.error){
                setError(data.error);
            }
            else{ 
                //setproductsBySell(productsBySell=>productsBySell.concat(data));
                setproductsBySell(data);
            }
        });
    };

    const loadProductsByArrival=()=>{
        getProducts('createdAt')
        .then(data=>{
            if(data.error){
                setError(data.error);
            }
            else{   
                //setproductsByArrival(productsByArrival=>productsByArrival.concat(data));
                setproductsByArrival(data);
            }
        });
    };

    useEffect(()=>{
        loadProductsByArrival();
        loadProductsBySell();
    },[]);

    return(
        <Layout title='Home Page' description='E-commerce App' className="container-fluid">
            <Search />
            <h2 className="mb-4">New Arrivals</h2>
            <div className="row">
                {productsByArrival.map((product,i)=>(
                    <Card key={i} product={product} />
                ))}
            </div>

            <br/><br/>
            <h2 className="mb-4 ">Best Sellers</h2>
            <div className='row'>
                {productsBySell.map((product,i)=>(
                    <Card key={i} product={product} />
                ))}
            </div>

        </Layout>
    );
};

export default Home;