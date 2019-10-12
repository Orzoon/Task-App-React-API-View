import React from "react";
import {Redirect} from 'react-router-dom'

 
 import LoginForm from './LoginForm';
 import Header from './Header';

export default class Home extends React.Component{

  componentDidMount(){
   
  }
  render (){
  
  return (this.props.isLoggedIn) ?  <Redirect to ='/app' /> :     
    <div className="MainContainer">
      <Header/>
      <LoginForm isLoggedIn = {this.props.isLoggedIn} loginController = {this.props.loginController}/>
    </div> 
  }
}


