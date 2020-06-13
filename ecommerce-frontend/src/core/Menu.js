import React,{Fragment} from 'react';
import {withRouter,Link} from 'react-router-dom';
import {signout,isAuthenticated} from '../auth';
import {itemTotal} from './cartHelpers';

const isActive=(history,path)=>{
    if(history.location.pathname===path){
        return {color: '#ff9900'};
    }
    else    
        return {color:'#ffffff'};
};

const Menu=({history})=>(
    <div style={{position:"-webkit-sticky",position:"sticky",top:0,zIndex:12}}>
        <ul className="nav nav-tabs bg-primary" >    
            <li className="nav-item">
                <Link className="nav-link" style={isActive(history,'/')} to="/">
                    Home
                </Link>
            </li>
            

            {isAuthenticated() && isAuthenticated().user.role===0 && (
                <li className="nav-item">
                    <Link className="nav-link" style={isActive(history,'/user/dashboard')} to="/user/dashboard">
                        Dashboard
                    </Link>
                </li>
            )}


            {isAuthenticated() && isAuthenticated().user.role===1 && (
                <li className="nav-item">
                    <Link className="nav-link" style={isActive(history,'/admin/dashboard')} to="/admin/dashboard">
                        Dashboard
                    </Link>
                </li>
            )}

                
            <li className="nav-item">
                <Link className="nav-link" style={isActive(history,'/shop')} to="/shop">
                    Shop
                </Link>
            </li>


            <li className="nav-item">
                <Link className="nav-link" style={isActive(history,'/cart')} to="/cart">
                    Cart <sup className="badge badge-dark">{itemTotal()}</sup>
                </Link>
            </li>



            {
                //if user is  authenticated(or,logged in),don't show signin and signup options
                //also, Fragment is used because we needed to wrap multiple blocks else <div> would
                //have created extra node to the DOM, tus messing the styling.
            }
            {!isAuthenticated() && (
                <Fragment>
                    <li className="nav-item">
                        <Link className="nav-link" style={isActive(history,'/signin')} to="/signin">
                            SignIn
                        </Link>
                    </li>
                    <li className="nav-item">
                        <Link className="nav-link" style={isActive(history,'/signup')} to="/signup">
                            SignUp
                        </Link>
                    </li>
                </Fragment>
            )}

            {
                //if user is  authenticated(or,logged in),show signout option as well
            }
            {isAuthenticated() && (
                <li className="nav-item">
                    <span className="nav-link" style={{cursor:'pointer', color:'#ffffff'}} 
                            onClick={()=>signout(()=>{
                                history.push('/');  //redirect the user to home page 
                            })}>
                        SignOut
                    </span>
                </li>
            )}

        </ul>
    </div>
);

export default withRouter(Menu);