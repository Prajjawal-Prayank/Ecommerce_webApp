import React,{useState,useEffect,Fragment} from 'react';
import {Link} from 'react-router-dom';
import {getBraintreeClientToken,processPayment,createOrder} from './apiCore';
import {isAuthenticated} from '../auth';
import '../styles2.css'
import DropIn from 'braintree-web-drop-in-react';
import {emptyCart} from './cartHelpers';


const Checkout=({products})=>{

    const [data,setData]=useState({
        success:false,
        clientToken: null,
        error:'',
        instance:{},
        address:''
    });

    const [modal,makeVisible]=useState(false);
    const [sc,setSc]=useState(true);
    const [ta,setTa]=useState(false);

    const userId=isAuthenticated() && isAuthenticated().user._id;
    const token=isAuthenticated() && isAuthenticated().token;

    const getToken=(userId,token)=>{
        getBraintreeClientToken(userId,token)
            .then(data=>{
                if(data.error){
                    setData({...data,error: data.error});
                }else{
                    setData({clientToken:data.clientToken});
                }
            })
    };

    useEffect(()=>{
        getToken(userId,token);
    },[]);

    const getTotal=()=>{
        var grandTotal=products.reduce((currentTotal,currentItem)=>{
            return currentTotal + (currentItem.count * currentItem.price);
        },0);
        return ((grandTotal*100)/100).toFixed(2);
    };

    const showModalFun=modal=>()=>{ 
        data.address ? makeVisible(!modal) : 
                    window.alert('Please fill in the Delivery Address to proceed');           
    };

    const showTa=()=>{
        setTa(true);
        setSc(false);
    }

    const handleAddress=event=>{
        setData({...data,address:event.target.value});
    }

    const showCheckout=val=>(
        val? (<div>
            {isAuthenticated() ? (
                    <button className="btn " onClick={showTa} style={{background:"yellow"}}>
                       <b>Checkout -&gt;</b>
                    </button>
                ):(
                    <Link to="/signin">
                        <button className="btn btn-primary">
                            <b>Sign in to Checkout -&gt;</b>
                        </button>
                    </Link>
            )}
        </div>):null
    );

    const buy=()=>{
        let deliveryAddress=data.address;
        //we send nonce to server
        //nonce=data.instance.requestPaymentMethod();
        let nonce;
        let getNonce=data.instance.requestPaymentMethod()
            .then(data=>{
                nonce=data.nonce;
                //we now send nonce to backend as paymentMethodNonce along with total amount

                const paymentData={
                    paymentMethodNonce: nonce,
                    amount: getTotal(products)
                };

                processPayment(userId,token,paymentData)
                .then(response=>{  
                    //setData({...data,success: response.success}); 

                
                const createOrderData={
                    products: products,
                    transaction_Id: response.transaction.id,
                    amount: response.transaction.amount,
                    address: deliveryAddress
                }
                

                createOrder(userId,token,createOrderData)
                    .then(response=>{
                        emptyCart(()=>{
                            console.log("payment done and cart is emptied");
                        });
                        setData({...data,success: true}); 
                    })            
                })
                .catch(err=>{
                    setData({...data,error:err});
                });

            })
            .catch(err=>{
                setData({...data,error: err.message});
            });
    };


    const showDropIn=()=>(
        <div onClick={()=>setData({...data,error:""})}>
            {data.clientToken!=null && products.length>0 ? (
                <div >
                    <DropIn options={{
                            authorization: data.clientToken
                        }} onInstance={instance=>(data.instance=instance)}
                    />
                    
                </div>   
            ):(null)}
        </div>

    );

    const showError=error=>(
        <div className="alert alert-danger" style={{display:error?'':'none'}}>
            {error}
        </div>
    );

    const showSuccess=success=>(
        <Fragment>
            <div className="alert alert-info" style={{display:success?'':'none'}}>
                Payment Successful..!
            </div>
            <div className="invisible">
                {(success==true)?setTimeout(()=>window.location.reload(),300):null}
            </div>
        </Fragment>
    );

    const [load,showLoad]=useState(true)
    const showLoading=()=>{
        if(load){
            return (
                <div id="loading" className="text-muted">
                    <h6>This may take a few seconds... Please refrain from reloading or closing tab.</h6>
                </div>
            )
        }
        
    }

    const showModal=(modal)=> modal? (
            <div id="myModal1" className="modal1" >                
                <div className="modal1-content"  >
                    <div className="modal1-header">
                        <span onClick={showModalFun(modal)} className="close">&times;</span>
                        <p className="mt-3"><b>Please fill in the details to continue.</b></p>
                    </div>
                    <div className="modal1-body" >
                        {showError(data.error)}
                        {showSuccess(data.success)}
                        {showLoading()}
                        <div className='invisible'>{setTimeout(()=>showLoad(false),3000)}</div>
                        <div>
                            {showDropIn()}
                            {data.success? null:(
                                <button onClick={buy} style={{float:"right"}}>Pay</button>)}
                        </div>                        
                    </div>
                    <div className="modal1-footer"></div>                    
                </div>
            </div>
        ):(null);
 

    const showPayment=val=>{
        return (val && <div className="mb-4">
        <h3>Delivery Address</h3>
        <textarea onChange={handleAddress} className="form-control"
            value={data.address} placeholder="Type delivery address..." />
            
        <button className="btn mt-3" onClick={showModalFun(modal)} style={{float:"right",background:"orange"}}>
            <b>Proceed to Pay -&gt;</b>
        </button>    
    </div> )
    }
    

    return (
        <Fragment>
            <table id="bill" className="mb-5">
                <thead>
                    <tr>
                        <th>Product</th>
                        <th>Price(Rs)</th>
                        <th>Quantity</th>
                        <th>Total(Rs)</th>
                    </tr>
                </thead>
                <tbody>
                {products.map((p,i)=>(
                    <tr key={i}>
                        <td>{p.name}</td>
                        <td>{p.price}</td>
                        <td>{p.count}</td>
                        <td>{p.count * p.price}</td>
                    </tr>
                ))}
                </tbody>
                <tfoot>
                    <tr >
                        <td colSpan="3"><center><b>Grand total:-</b></center></td>
                        <td style={{background:"#003399",color:"white"}}><b>Rs {getTotal()} </b></td>
                    </tr>
                </tfoot>
            </table>  

            {showPayment(ta)}

            <div style={{marginBottom :"100px",float: "right"}}>
                {showCheckout(sc)}                                
            </div>
            <div className="mt-5">
                {showModal(modal)}
            </div>
            
        </Fragment>

    )
};

export default Checkout;