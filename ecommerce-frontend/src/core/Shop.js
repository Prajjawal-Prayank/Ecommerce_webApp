import React,{useState,useEffect} from 'react';
import Layout from './Layout';
import Card from './Card';
import {getCategories,getFilteredProducts} from './apiCore';
import Checkbox from './Checkbox';
import {prices} from './fixedPrices';
import RadioBox from './RadioBox';

const Shop=()=>{

    const [myFilters,setMyFilters]=useState({
        filters:{category:[],price:[]}
    })
    const [categories,setCategories]=useState([]);
    const [error,setError]=useState(false);
    const [limit,setLimit]=useState(6);
    const [skip,setSkip]=useState(0);
    const [size,setSize]=useState(0);
    const [filteredResults,setFilteredResults]=useState(0);

    const init=()=>{
        getCategories()
        .then(data=>{
            if(data.error){
                setError(data.error)
            }else{       
                setCategories(data);               
            }
        })
    };

    const loadFilteredResults=(newFilters)=>{
        getFilteredProducts(skip,limit,newFilters)
        .then(data=>{
            if(data.error){
                setError(data.error)
            }else{       
                setFilteredResults(data.data);      
                setSize(data.size);
                setSkip(0);         
            }
        })
    };


    const loadMore=()=>{
        let toSkip=skip+limit;
        getFilteredProducts(toSkip,limit,myFilters.filters)
        .then(data=>{
            if(data.error){
                setError(data.error)
            }else{       
                setFilteredResults([...filteredResults,...data.data]);      
                    //we append the new data we receive to the data we already had
                setSize(data.size);
                setSkip(toSkip);         
            }
        })
    };


    const loadMoreButton=()=>{
        return (
            size>0 && size>=limit && (
                <button onClick={loadMore} className="btn btn-warning mb-5">
                    Load more
                </button>
            )
        )
    }

    useEffect(()=>{
        init();
        loadFilteredResults(skip,limit,myFilters.filters);
    },[]);


    const handleFilters=(filters,filterBy)=>{
        const newFilters={...myFilters};    
        newFilters.filters[filterBy]=filters;

        if(filterBy==='price'){
            let priceValues=handlePrice(filters);
            newFilters.filters[filterBy]=priceValues;
        }

        loadFilteredResults(myFilters.filters);

        setMyFilters(newFilters);
    }

    const handlePrice=value=>{
        const data=prices;
        let array=[]
        for(let key in data){
            if(data[key]._id===parseInt(value)){
                array=data[key].array;
            }
        }
        return array;
    }

    const showEmpty=()=>{
        return (
            <h2 className="text-muted">
                <div style={{display:(!size)?'':'none'}}>
                        No products found in this filter. Try out some other filter options .
                </div>
            </h2>
        )
    }

    
    

    return (
        <Layout title='Welcome!' 
            description='Be a Shopaholic! Now choose from a wide variety of products.' 
            className="container-fluid">
            <div className="row">
                <div className="col-4">
                    {categories.length>0?(<div>
                    <h4>Filter by categories</h4>
                    <ul>
                        <Checkbox categories={categories} 
                            handleFilters={filters=>handleFilters(filters,'category')} />
                    </ul></div>):null}
                    <h4>Filter by price</h4>
                    <div>
                        <RadioBox prices={prices} 
                            handleFilters={filters=>handleFilters(filters,'price')} />
                    </div>
                </div>
                <div className="col-8">
                    <h2 className="mb-4-">Products</h2>
                    <div className="row">  
                        {filteredResults.length>0 ? filteredResults.map((product,i)=>
                            <Card key={i} product={product} />                             
                        ) : " "
                        }
                    </div>
                    <br></br>
                    {showEmpty()}
                    {loadMoreButton()}
                </div>
            </div>
        </Layout>
    );
};


export default Shop;             