import React, {Component} from 'react';
import {BrowserRouter, Switch,Route} from 'react-router-dom';


import Home from './Component/Home/Home';
import Mainapp from './Component/App/Mainapp'
import ProtectedRoute from './Protected/ProtectedRoute';


import {Authentication, getCookie} from './helper/helper';

export default class App extends Component{
 constructor(props){
   super(props);
   this.state = {
     isLoggedIn: false, //set based in token later
     redirectToApp: false,
     loading: true
   }
   this.loginController = this.loginController.bind(this)
 }
 componentDidMount(){
    const initAuthCheck = Authentication.isLoggedIn();
    if(initAuthCheck){
      this.setState({
        isLoggedIn: true,
        redirectToApp: true,
        loading: false
      })
    }else{
      this.setState({
        loading: false
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
            <ProtectedRoute path ='/app' component = {Mainapp}/>
          </Switch>
        </div>
     </BrowserRouter>
     
   )
 }
}

