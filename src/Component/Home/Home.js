import React from "react";
import {Redirect} from 'react-router-dom'

 
 import LoginForm from './LoginForm';
 import SignupForm from './SignupForm';
 import Header from './Header';
 import Footer from './Footer';

export default class Home extends React.Component{
  constructor(props){
    super(props);
    this.state = {
      loginForm:true
    }
    this.toggleForm = this.toggleForm.bind(this)
  }

  componentDidMount(){
   
  }
  toggleForm(e){
    e.preventDefault();
    console.log('hello')
    this.setState({
      loginForm: !this.state.loginForm
    })

  }
  render (){
  
  return (this.props.isLoggedIn) ?  <Redirect to ='/app' /> :     
    <div className="MainContainer">
      <Header/>
      { (this.state.loginForm === true) ?
        <LoginForm 
          isLoggedIn = {this.props.isLoggedIn} 
          loginController = {this.props.loginController}
          toggleForm = {this.toggleForm}
        /> :
        <SignupForm 
          toggleForm = {this.toggleForm}
          loginController = {this.props.loginController}
        />

      
      }
      <Footer />
    </div> 
  }
}


