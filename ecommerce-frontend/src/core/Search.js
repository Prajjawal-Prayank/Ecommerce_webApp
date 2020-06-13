import React,{useState,useEffect} from 'react';
import {getCategories,list} from './apiCore';
import Card from './Card';

const Search=()=>{
    const [data,setData]=useState({
        categories:[],      //will help in displaying all the categories
        category:'',        //will tell us what category is selected
        search:'',          //will keep whatever text is written in search field
        results:'',         //will keep output of SEARCH
        searched:false
    });

    const {categories,category,search,results,searched}=data;

    const loadCategories=()=>{
        getCategories()
        .then(data=>{
            if(data.error){
                console.log(data.error);
            }else{
                setData({...data,categories: data});
            }
        })
    }

    useEffect(()=>{
        loadCategories();
    },[]);

    const searchData=()=>{
        if(search){
            list({search:search || undefined, category:category})
            .then(response=>{
                if(response.error){
                    console.log(response.error);
                }else{
                    setData({...data,results:response,searched:true});
                }
            });
        }
    };

    const searchSubmit=(event)=>{
        event.preventDefault();
        searchData();
    };

    const handleChange=name=>event=>{
        setData({...data,[name]:event.target.value,searched:false});
    };


    const searchMessage=(searched,results)=>{
        if(searched){
            if(results.length>0)
                return `Found ${results.length} products`;
            if(results.length<1)
                return `No products found`;     
        }
    }

    const searchedProducts=(results=[])=>{
        return (
            <div>
                <h2 className="mt-4 mb-4">
                    {searchMessage(searched,results)}
                </h2>
                <div className="row" > 
                    {results && results.map((product,i)=>(
                        <Card key={i} product={product} />
                    ))}
            </div>
            </div>
        );
    };

    const searchForm=()=>(
        //span is used in the form because we want to to show all the 3 components (category selector,
        //,search input field,search button) in a single line 
        <form onSubmit={searchSubmit}>
            <span className="input-group-text"> 
                <div className="input-group-prepend">
                    <select className="btn mr-2" onChange={handleChange("category")}>
                        <option value="All">All</option>
                            {categories.map((c,i)=>(
                                <option key={i} value={c._id} >{c.name}</option>
                            ))}
                    </select>
                </div>

                <div className="input-group input-group-lg">
                    <input type="search" className="form-control" onChange={handleChange("search")} 
                        placeholder="Search for products" />
                </div>

                <div className="input-group-append" style={{border:'none'}}>
                    <button className="input-group-text ml-2">Search </button>
                </div>

            </span>
        </form>
    );

    return (
        <div className="row" >
            <div className="container mb-3">
                {searchForm()}
            </div>
            <div className="container-fluid mb-3">
                {searchedProducts(results)}
            </div>
        </div>
    );
};

export default Search;