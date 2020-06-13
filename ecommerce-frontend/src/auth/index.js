import {API} from '../config';

export const signup=(user)=>{          //user has name,email,password
    return fetch(`${API}/signup`,{             //fetch(url,object)
        method:"POST",      
        headers:{
            Accept:'application/json',          //tells the server that which content-type is understandable by the client 
            "Content-Type" : "application/json",    //this tells backend that we are sending a json object
        },
        body: JSON.stringify(user)
    })
        .then(response=>{
            return response.json();
        })
        .catch(err=>{
            console.log(err);
        });
};


export const signin=(user)=>{          //user has name,email,password
    return fetch(`${API}/signin`,{             //fetch(url,object)
        method:"POST",      
        headers:{
            Accept:'application/json',          //tells the server that which content-type is understandable by the client 
            "Content-Type" : "application/json",    //this tells backend that we are sending a json object
        },
        body: JSON.stringify(user)
    })
        .then(response=>{
            return response.json();
        })
        .catch(err=>{
            console.log(err);
        });
};


export const aurhenticate=(data,next)=>{
    if(typeof window !== 'undefined'){      //if browser has no info of any user, store this user's info
        localStorage.setItem('jwt',JSON.stringify(data));   //sets item in the local storage
        next();
    }
}

export const signout=(next)=>{
    if(typeof window !== 'undefined'){      //if browser has info of user, delete it
        localStorage.removeItem('jwt');
        next();                             //next() can be before last line of a function as well ..!!
        return fetch(`${API}/signout`,{
            method:'GET'
        })
        .then(response=>{
            console.log('signout',response);
        })
        .catch(err=>{
            console.log(err);
        });
    }
};


export const isAuthenticated=()=>{
    if(typeof window == 'undefined'){
        return false;
    }
    if(localStorage.getItem('jwt')){
        return JSON.parse(localStorage.getItem('jwt'));
    }else
        return false;
}