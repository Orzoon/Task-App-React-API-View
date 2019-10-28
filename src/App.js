import React, {Component} from 'react';
import {BrowserRouter, Switch,Route} from 'react-router-dom';
import './css/body.scss'
import Home from './Component/Home/Home';
import Mainapp from './Component/App/Mainapp'
import ProtectedRoute from './Protected/ProtectedRoute';


import {Authentication, getCookie, apiBaseLink} from './helper/helper';

export default class App extends Component{
 constructor(props){
   super(props);
   this.state = {
     isLoggedIn: false, //set based on token later
     redirectToApp: false,
     loading: true
   }
   this.loginController = this.loginController.bind(this)
   this.logoutController = this.logoutController.bind(this)
 }
 componentDidMount(){
    const initAuthCheck = Authentication.isLoggedIn();
    if(initAuthCheck){
      const token = getCookie('token');
      const parent = this;
      fetch(apiBaseLink+'/users/me', {
        method: 'GET',
        headers: {
            'authorization': `Bearer ${token}`
        }
      })
      .then(response => {
        if(response.ok){
          parent.setState({
            isLoggedIn: true,
            redirectToApp: true,
            loading: false
          })
        }
        else{
          parent.setState({
            loading: false
          })
        }
      })
    }
 }

 loginController(){
   this.setState({
     isLoggedIn: true,
     redirectToApp: true,
     loading: false
   })
 }
logoutController(){
  Authentication.isLoggedOut();
  this.setState({
    isLoggedIn: false, //set based in token later
    redirectToApp: false
  })
}
 render(){
   return (
     (this.state.loading) ? 'loading ...' : 
     <BrowserRouter>
        <div className = "wholeContainer"> 
          <Switch>
            <Route exact 
              path='/' 
              render = {(props) => <Home {...props}
                                        isLoggedIn = {this.state.isLoggedIn} 
                                        loginController = {this.loginController}
                                        />} />
            <ProtectedRoute path ='/app' logoutController = {this.logoutController} component = {Mainapp} />
            <Route component = {() => {
              return <h1>This page Does not exist!!</h1>
            }} />
          </Switch>
        </div>
     </BrowserRouter>
     
   )
 }
}

