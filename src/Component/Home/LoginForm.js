import React from 'react';
import {Redirect} from 'react-router-dom';
import "../../css/login.scss";
import {apiBaseLink,setCookie,Authentication} from '../../helper/helper';
import {TextField, Button} from '@material-ui/core'



export default class LoginForm extends React.Component {
    constructor(props){
        super(props);
        this.state ={
            username: '',
            password: '',
            redirect: null,
            loading: false,
            errorMessage: ''
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
       this.setState({
           loading: true
       })
        e.preventDefault();
        let parent = this;
        if(this.state.username.length === 0 || this.state.password === 0){
            this.setState({
                loading:false,
                errorMessage: 'please fill up the login form!!'
            })

            return 
        }
        else {
            this.setState({
                errorMessage: ''
            })
        }
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
            if(response.status === 400){
                this.setState({
                    loading: false
                })
                throw new Error('please fill in the form correctly!!');
            }
            return response.json()
        })
        .then(data => {
            if(!data){
                return
            }
            
            setCookie('token', data.token)
            Authentication.isLoggedIn();
            console.log(Authentication.loggedIn)
            parent.setState({
                password: '',
                username: '',
                redirect: true,
                loading:false
            })
            parent.props.loginController();
          
        })
        .catch(error => {
            console.log('error', error)
            parent.setState({
                loading: false,
                errorMessage: error.message
            })
        })
   }

    render (){
        const style = {
            backgroundColor:"#1976D2"
        }


        const {redirect} = this.state;
        if(redirect){
          return <Redirect to ='/app' />
        }
        return (
            <div className="loginFormContainer">
                <form className = "loginForm">  
                    <div className = "formHeading">
                       have account!! :)
                    </div>
                    {(this.state.errorMessage.length !== 0) ? 
                            <div className = "errorMessage">
                                <p>{this.state.errorMessage}</p>
                            </div> :
                            null
                    }
                    <div className = "input">
                        <TextField
                            fullWidth
                            variant="outlined"
                            id="standard-dense"
                            label="email"
                            margin="dense"
                            onChange = {this.formHandler}
                            name ="username" 
                            id="username" 
                            type="email" 
                        />
                    </div>
                    <div className = "input">
                          <TextField
                            fullWidth
                            variant="outlined"
                            id="password" 
                            type="password" 
                            label="password"
                            margin="dense"
                            id="password"  
                            name ="password" 
                            onChange = {this.formHandler}
                        />
                    </div>
                    <div className = "btn-login">
                        <Button
                        style = {style}
                        variant = "contained"
                        color ="primary"
                        onClick = {this.signIn}
                        > {(this.state.loading) ? '......': 'login'}
                        </Button>
                    </div>
                    <div className = "signup-link">
                        <a href = "/" onClick = {(e) => {this.props.toggleForm(e)}}>Sign up</a>
                    </div>
                </form>
            </div>
        )
    }
}

