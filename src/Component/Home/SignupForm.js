import React from 'react';
import {Redirect} from 'react-router-dom';
import {Button, TextField} from '@material-ui/core'
import {apiBaseLink,setCookie,Authentication} from '../../helper/helper';
import "../../css/signup.scss";






export default class SignupFrom extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            user: {
                name: '',
                email: '',
                password: '',
                confirmPassword: ''
            },
            loading: false,
            errorMessage: '',
            redirect:false
        }
        this.formHandler = this.formHandler.bind(this)
        this.signup = this.signup.bind(this)
    }

    formHandler(e){
        e.preventDefault();

        let name = e.target.name;
        let value = e.target.value;

        const userCopy = {...this.state.user}
        userCopy[name] = value
        this.setState({
            user: userCopy
        })
    }

    signup(e){
        this.setState({
            loading: true
        })
        e.preventDefault();
        const userCopy = {...this.state.user}
        const userArray = Object.keys(userCopy);

        // checking for empty fields
        for(let i = 0 ; i < userArray.length ; i ++){
            if(userCopy[userArray[0]].length === 0){
                this.setState({
                    errorMessage: 'Fields must not be empty',
                    loading: false
                })

                return 
            }
        }
        if(this.state.user.password !== this.state.user.confirmPassword){
            this.setState({
                errorMessage: 'passwords do not match',
                loading: false
            })
            return
        }
        //deleting the property;;
        delete userCopy.confirmPassword;
        const parent = this;
        fetch(apiBaseLink + '/users', {
            method: 'POST',
            headers: {'content-type': 'application/json'},
            body: JSON.stringify(userCopy)
        })
        .then(response => {
            if(response.status === 404){
                return response.json().then(err => { throw err; });
            }else if(response.status === 201){
                return response.json() 
            }      
        })
        .then(data => {
            if(!data){
                parent.setState({
                    //errorMessage: error.message,
                    loading: false
                })
                return
            }
            setCookie('token', data.token)
            Authentication.isLoggedIn();
            parent.setState({
                redirect: true,
                loading: false
            })
            parent.props.loginController();
        })
        .catch(error => {
            if(error.hasOwnProperty('errors')){
                if(error.errors.hasOwnProperty('email')){
                    delete error.message
                    error.message = error.errors.email.message
                }else if(error.message = 'password` is shorter than the minimum allowed length (7).'){
                    error.message = 'password` is shorter than the minimum allowed length (7).'
                }
            }
            else if(error.hasOwnProperty('message')) {
                if(error.message.trim() === 'Failed to fetch'){
                    error.message = 'please check your internet connection'
                }
            }
            else if(error.hasOwnProperty('code')){
                if(error.code === 11000){
                    error.message = 'email already exists!!'
                }
            }
            else {
                error.message = 'oops!! something terrible happened!!'
            }
            parent.setState({
                errorMessage: error.message,
                loading: false
            })
        })

    }
    render (){
        const style = {
            backgroundColor:"#1976D2"
        }
        if(this.state.redirect){
            return <Redirect to = '/app' />
        }
        return (
            <div className="signupFormContainer">
                <form className = "signupForm">  
                    <div className = "formHeadingSignup">
                     create account!! :)
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
                            label="username"
                            margin="dense"
                            onChange = {this.formHandler}
                            name ="name" 
                            id="username" 
                            type="text" 
                        />
                    </div>
                    <div className = "input">
                        <TextField
                            fullWidth
                            variant="outlined"
                            label="email"
                            margin="dense"
                            onChange = {this.formHandler}
                            name ="email" 
                            id="name" 
                            type="email" 
                        />
                    </div>
                    <div className = "input">
                        <TextField
                            fullWidth
                            variant="outlined"
                            type="password" 
                            label="password"
                            margin="dense"
                            id="password"  
                            name ="password" 
                            onChange = {this.formHandler}
                        />
                    </div>
                    <div className = "input">
                        <TextField
                            fullWidth
                            variant="outlined"
                            type="password" 
                            label="conform password"
                            margin="dense"
                            name ="confirmPassword" 
                            onChange = {this.formHandler}
                        />
                    </div>
                    <div className = "btn-signup">
                        <Button
                        style = {style}
                        variant = "contained"
                        color ="primary"
                        onClick = {this.signup}
                        > {(this.state.loading) ? '......' : 'signup'}
                        </Button>
                    </div>
                    <div className = "signup-link">
                        <a href = "#" onClick = {(e) => {this.props.toggleForm(e)}}>login</a>
                    </div>
                </form>
        </div>
        )
    }
}
