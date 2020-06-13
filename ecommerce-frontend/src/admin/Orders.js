import React,{useState,useEffect} from "react";
import Layout from '../core/Layout';
import {isAuthenticated} from '../auth';
import {listOrders,getStatusValues,updateOrderStatus} from './apiAdmin';
import moment from 'moment';
import {Accordion,Card} from 'react-bootstrap';



const Orders=()=>{
    const [orders,setOrders]=useState([]);
    const [statusValues,setStatusValues]=useState([]);

    const {user,token}=isAuthenticated();

    const loadOrders=()=>{
        listOrders(user._id,token)
            .then(data=>{
                if(data.error){
                    console.log(data.error);
                }else{
                    setOrders(data);
                }
            });
    };


    const loadStatusValues=()=>{
        getStatusValues(user._id,token)
            .then(data=>{ 
                if(data.error){
                    console.log(data.error);
                }else{
                    setStatusValues(data);  
                }
            })
    };

    useEffect(()=>{
        loadOrders();
        loadStatusValues();
    },[]);


    const handleChangeStatus=(e,orderId)=>{
        updateOrderStatus(user._id,token,orderId,e.target.value)
            .then(data=>{ 
                if(data.error){
                    console.log("Failure in status updation");
                }else{
                    loadOrders();
                }
            })
    }


    const showStatus=o=>(
        <div className="form-group">
            <h3 className="mark mb-4">Status :  {o.status}</h3>
            <select className="form-control" onChange={e=>handleChangeStatus(e,o._id)}>
                <option>Update Status</option>
                {statusValues.map((status,idx)=>(
                    <option key={idx} value={status}>{status}</option>
                ))}
            </select> 
        </div>
    )


    const showOrdersLength=()=>(
        orders.length>0? (
            <h1 className="text-danger ">
                Total Orders : {orders.length} 
            </h1>
        ):(
            <h1 className="text-danger text-muted">
                No Orders to display...
            </h1>
        )
    );


    const showInput=(key,value)=>(
        <div className="input-group mb-2 mr-sm-2">
            <div className="input-group-prepend">
                <div className="input-group-text"><b>{key}</b> </div>
            </div>
            <input type="text" value={value} key={`key+value`} className="form-control" readOnly />
        </div>
    )

    



    const accordion=()=>{
        return (
                <Accordion>
                    {orders.map((order,i)=>(
                        <Card key={i}>
                            <Accordion.Toggle as={Card.Header} eventKey={i}>
                                <center><b>Order Id :-</b>  {order._id}</center>
                            </Accordion.Toggle>
                            <Accordion.Collapse eventKey={i}>
                                <Card.Body> 
                                    <ul className="list-group mb-2">
                                        <li className="list-group-item" key={`${order._id}+${i}`}><b>Status :- </b>{showStatus(order)}</li>
                                        <li className="list-group-item" key={`${order.transaction_Id}+${i}`}><b>TransactionId :- </b>{order.transaction_Id}</li>
                                        <li className="list-group-item" key={`${order.amount}+${i}`}><b>Amount :- </b>Rs {order.amount}</li>
                                        <li className="list-group-item" key={`${order.user.name}+${i}`}><b>Ordered by :- </b>{order.user.name}</li>
                                        <li className="list-group-item" key={`${order.createdAt}+${i}`}><b>Ordered on :- </b>{moment(order.createdAt).fromNow()}</li>
                                        <li className="list-group-item" key={`${order.address}+${i}`}><b>Delivery address :- </b>{order.address}</li>
                                    </ul>
                                    
                                    <h3 className="mt-4 mb-4 font-italic">
                                        Total products in the order : {order.products.length}
                                    </h3>
                                    <ul>
                                        {order.products.map((p,idx)=>(
                                            <div className="mb-4" key={idx} style={{padding:'20px',border:'1px solid indigo'}}>
                                                {showInput('Product name',p.name)}
                                                {showInput('Product price',p.price)}
                                                {showInput('Product total',p.count)}
                                                {showInput('Product id',p._id)}
                                            </div>
                                        ))}
                                    </ul>    
                                </Card.Body>
                            </Accordion.Collapse> 
                        </Card>           
                    ))}
                </Accordion>    
            );
    };



    return (
        <Layout title="Orders"  >
            <div className="row">
                <div className="col-md-8 offset-md-2">
                    {showOrdersLength()}  
                    {accordion()}
                </div>
            </div>
        </Layout>
    )

}

export default Orders;          