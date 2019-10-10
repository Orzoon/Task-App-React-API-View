import React from "react";
import {Redirect} from 'react-router-dom'

 
 import LoginForm from './LoginForm';
 import Header from './Header';

export default class Home extends React.Component{

  render (){
  
  return (this.props.redirectToApp) ?  <Redirect to ='/app' /> :     
    <div className="MainContainer">
      <Header/>
      <LoginForm isLoggedIn = {this.props.isLoggedIn} loginController = {this.props.loginController}/>
    </div> 
  }
}


