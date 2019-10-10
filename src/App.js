import React, {Component} from 'react';
import {BrowserRouter, Switch,Route} from 'react-router-dom';


import Home from './Component/Home/Home';
import Mainapp from './Component/App/Mainapp'
import ProtectedRoute from './Protected/ProtectedRoute';

//import {Authentication} from './Protected/ProtectedRoute';

export default class App extends Component{
 constructor(props){
   super(props);
   this.state = {
     isLoggedIn: false, //set based in token later
     redirectToApp: false
   }
   this.loginController = this.loginController.bind(this)
 }

 loginController(){
   this.setState({
     isLoggedIn: true,
     redirectToApp: true
   })
 }
 render(){
   return (
     <BrowserRouter>
        <div className = "wholeContainer"> 
          <Switch>
            <Route exact 
              path='/' 
              render = {(props) => <Home {...props}
                                        isLoggedIn = {this.state.isLoggedIn} 
                                        loginController = {this.loginController}
                                        redirectToApp = {this.state.redirectToApp}
                                        />} />
            <ProtectedRoute path ='/app' component = {Mainapp}/>
          </Switch>
        </div>
     </BrowserRouter>
     
   )
 }
}

