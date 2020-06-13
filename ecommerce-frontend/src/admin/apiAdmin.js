import {API} from '../config';

export const createCategory=(userId,token,category)=>{    
    return fetch(`${API}/category/create/${userId}`,{             //fetch(url,object)
        method:"POST",      
        headers:{
            Accept:'application/json',          //tells the server that which content-type is understandable by the client 
            "Content-Type" : "application/json",    //this tells backend that we are sending a json object
            Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(category)
    })
        .then(response=>{
            return response.json();
        })
        .catch(err=>{
            console.log(err);
        });
};


export const createProduct=(userId,token,product)=>{    
    return fetch(`${API}/product/create/${userId}`,{             //fetch(url,object)
        method:"POST",      
        headers:{
            Accept:'application/json',          //tells the server that which content-type is understandable by the client 
            //"Content-Type" : "application/json", //we don't need this here as we are sending form data here and not json
            Authorization: `Bearer ${token}`
        },
        body: product   //product will be form-data
    })
        .then(response=>{
            return response.json();
        })
        .catch(err=>{
            console.log(err);
        });
};



export const getCategories=()=>{
    return fetch(`${API}/categories`,{
        method: "GET"
    })
    .then(response=>{
        return response.json();
    })
    .catch(err=>console.log(err));
}



export const listOrders=(userId,token)=>{
    return fetch(`${API}/order/list/${userId}`,{
        method: "GET",
        headers:{
            Accept:'application/json',          //tells the server that which content-type is understandable by the client         
            Authorization: `Bearer ${token}`
        },
    })
    .then(response=>{
        return response.json();
    })
    .catch(err=>console.log(err));
}




export const getStatusValues=(userId,token)=>{
    return fetch(`${API}/order/status-values/${userId}`,{
        method: "GET",
        headers:{
            Accept:'application/json',       
            Authorization: `Bearer ${token}`
        },
    })
    .then(response=>{
        return response.json();
    })
    .catch(err=>console.log(err));
};




export const updateOrderStatus=(userId,token,orderId,status)=>{
    return fetch(`${API}/order/:${orderId}/status/${userId}`,{
        method: "PUT",
        headers:{
            Accept:'application/json',  
            "Content-Type": 'application/json' ,    
            Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({orderId,status})
    })
    .then(response=>{
        return response.json();
    })
    .catch(err=>console.log(err));
};


/* working on Manage Products component */


export const getProducts=()=>{
    return fetch(`${API}/products`,{
        method: "GET"
    })
    .then(response=>{
        return response.json();
    })
    .catch(err=>console.log(err));
};


export const deleteProduct=(productId,userId,token)=>{
    return fetch(`${API}/product/${productId}/${userId}`,{
        method: "DELETE",
        headers:{
            Accept:'application/json',  
            "Content-Type": 'application/json' ,    
            Authorization: `Bearer ${token}`
        }
    })
    .then(response=>{
        return response.json();
    })
    .catch(err=>console.log(err));
};

export const getProduct=productId=>{
    return fetch(`${API}/product/${productId}`,{
        method: "GET"
    })
    .then(response=>{
        return response.json();
    })
    .catch(err=>console.log(err));
};


export const updateProduct=(productId,userId,token,product)=>{
    return fetch(`${API}/product/${productId}/${userId}`,{
        method: "PUT",
        headers:{
            Accept:'application/json',    
            Authorization: `Bearer ${token}`
        },
        body: product               //this product is sent as form-data.So , sontent-type is not  defined
    })
    .then(response=>{
        return response.json();
    })
    .catch(err=>console.log(err));
};