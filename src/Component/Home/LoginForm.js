import React from 'react';
import {Redirect} from 'react-router-dom';

import {apiBaseLink,setCookie,Authentication} from '../../helper/helper';




export default class LoginForm extends React.Component {
    constructor(props){
        super(props);
        this.state ={
            username: '',
            password: '',
            redirect: null
        }
        this.formHandler = this.formHandler.bind(this);
        this.signIn = this.signIn.bind(this);
    }

   formHandler(event){
       const name = event.target.name;
       const value = event.target.value;
       this.setState({
           [name]: value
       })
   }

   signIn(e){
        e.preventDefault();
        let parent = this;
        const data = {
            email: this.state.username,
            password: this.state.password
        }
        fetch(apiBaseLink + '/users/login', {
            method: 'POST',
            headers: {'content-type': 'application/json'},
            body: JSON.stringify(data)
        })
        .then(response => {
            //handle error  message here
            
            return response.json()
        })
        .then(data => {
            
            setCookie('token', data.token)
            Authentication.isLoggedIn();
            console.log(Authentication.loggedIn)
            parent.setState({
                password: '',
                username: '',
                redirect: true
            })
            parent.props.loginController();
          
        })
        .catch(error => console.log('error', error))
   }

    render (){


        const {redirect} = this.state;
        if(redirect){
          return <Redirect to ='/app' />
        }
        return (
            <div className="loginFormContainer">
                <form>  
                    <div>
                        <label htmlFor="username"></label>
                        <input 
                        type="text" 
                        className="input" 
                        id="username" 
                        name ="username" 
                        placeholder ="username@gmail.com" 
                        onChange = {this.formHandler}/>
                    </div>
                    <div>
                        <label htmlFor="password"></label>
                        <input 
                        type="password" 
                        className="input" 
                        id="password" 
                        name ="password" 
                        placeholder ="********" 
                        onChange = {this.formHandler}/>
                    </div>
                    <div>
                        <input 
                        type="button" 
                        className="btn" 
                        value="login" 
                        onClick = {this.signIn}
                        />
                    </div>
                </form>
            </div>
        )
    }
}

