import React from 'react';

import Task from './Task';
import Header from '../Home/Header';
import Footer from '../Home/Footer';
import ProfileEdit from './ProfileEdit';
import ErrorComponent from './ErrorComponent'
import {getCookie, apiBaseLink} from '../../helper/helper';

// CSS
//Icons
import{Icon} from 'antd';
import '../../css/loader.scss'
export default class Mainapp extends React.Component{
    constructor(props){
        super(props);
        this.toggleRef = React.createRef();
        this.state = {
            user: {
                _id: '',
                email: '',
                name: '',
                profileChange: false,
                password: '',
                conformPassword: ''
            },
            loading: true,
            userLoaded: false,
            profileToggle: false,
            profileSpinner: false,

            messages:  {}

        }
        this.logoutHandler = this.logoutHandler.bind(this)
        this.toggleHandler = this.toggleHandler.bind(this)
        this.outsideClickhandler =this.outsideClickhandler.bind(this)
        this.handleProfileEdit = this.handleProfileEdit.bind(this)
        this.handleProfileUpdate = this.handleProfileUpdate.bind(this)
        this.handlePassword = this.handlePassword.bind(this)
        this.deleteAccountHandler = this.deleteAccountHandler.bind(this)
        this.errorMessageHandler = this.errorMessageHandler.bind(this)
    }
    componentDidMount(){
        const parent = this;
        const token = getCookie('token').trim();
        
        fetch(apiBaseLink+'/users/me', {
            method: 'GET',
            headers: {
                'authorization': `Bearer ${token}`
            }
        })
        .then(response => response.json())
        .then(data => {
            const user = {...parent.state.user}
            user._id = data._id;
            user.name = data.name;
            user.email = data.email;
            parent.setState({
                user: user,
                loading: false,
                userLoaded: true
            })
          
           
        })
        .catch(error => console.log(error))
    }
    logoutHandler(e){
        this.setState({
            loading: true
        })
        e.preventDefault();
        const name = e.target.name;
        const token = getCookie('token')
        const parent = this;
        fetch(`${apiBaseLink}/users/${name}`, {
            method: 'POST',
            headers: {
                'authorization': `Bearer ${token}`
            }
        })
        .then(response => {
            if(response.status === 200){
                parent.setState({
                    userLoaded: false,
                    loading: true
                })
                parent.props.logoutController();
            }
        })
        .catch(error => console.log(error))
    }
    toggleHandler(){
        if(this.state.profileToggle === false){
            window.addEventListener('click', this.outsideClickhandler, false)
        }
        else if(this.state.profileToggle === true){
            window.removeEventListener('click', this.outsideClickhandler, false)
        }
         this.setState({
            profileToggle: !this.state.profileToggle
         })
           
    }
    outsideClickhandler(e){
        if(this.toggleRef.current.contains(e.target)){
            return
        }
        this.toggleHandler();
    }
    handleProfileEdit(e){
        if(e){
            e.preventDefault();
        }
        const userCopy = {...this.state.user}
        userCopy.profileChange = !this.state.user.profileChange
        this.setState({
           user: {...userCopy}
        })
    }
    handlePassword(e){
        e.preventDefault();
        const name = e.target.name;
        const value = e.target.value;
        const userCopy = {...this.state.user}
        userCopy[name] = value

        this.setState({
            user: {...userCopy}
        })
    }
    handleProfileUpdate(e){
        e.preventDefault();
        this.setState({
            profileSpinner: true
        })
        if(this.state.user.password.toString().trim().length === 0 ){
            //errpr Message that passwords do not match
            this.setState({
                profileSpinner: false
            })
            this.errorMessageHandler('add','warningMessage', 'empty password field !!')
            return;
        }
        else if((this.state.user.password.toString().trim() !== this.state.user.conformPassword.toString().trim())){
            this.setState({
                profileSpinner: false
            })
            this.errorMessageHandler('add','warningMessage', 'passwords do not match !!')
            return;
        }

        const data = {
            password : this.state.user.password
        }
        const token = getCookie('token')
        const parent = this;

        fetch(`${apiBaseLink}/users/me`,{
            method: 'PATCH',
            headers: {
                authorization: `Bearer ${token}`
            },
            body: JSON.stringify(data)
        })
        .then(res => res.json())
        .then(data => {
            // displaySuccessMessage
            parent.setState({
                password: '',
                conformPassword: '',
                profileSpinner: false
            })
            parent.errorMessageHandler('add','successMessage', 'password successfully updated!!')
            this.handleProfileEdit();
            console.log(data)
        })
        .catch(error => console.log(error))
    }
    deleteAccountHandler(e){
        this.toggleHandler();
        if(e){
            e.preventDefault();
        }
        const token = getCookie('token')
        if(window.confirm('are you sure you want to permanently delete your account')){
            fetch(`${apiBaseLink}/users/me`, {
                method: 'DELETE',
                headers: {
                    authorization: `Bearer ${token}`
                }
            })
            .then(res => res.json())
            .then(data => {
                // console.log( message)
            })
            .catch(error => console.log(error))
        }
        
    }

    //-------------------------------------------------------------------->
    errorMessageHandler(action, messageType, message){
        console.log('MessageType',messageType)
        console.log("message", message)

        const messageCopy = {...this.state.messages}
        messageCopy[messageType] = message
        this.setState({
            messages: {...messageCopy}
        })
        setTimeout(()=> {
            this.setState({
                messages: {}
            })
        },2000)
    }

    render(){
        const UserInfo = (  
            <div className="userInfo" ref={this.toggleRef} >
                <div className="profileIcon" onClick = {this.toggleHandler}>
                    <Icon type="user" /> 
                    {this.state.profileToggle &&
                        <ul className = "menuListUl">  
                            <li 
                                className = "menuList">
                                    <button onClick = {this.handleProfileEdit}>Edit Profile</button>
                            </li>
                            <li 
                                className = "menuList">
                                    <button name = 'logout' onClick = {this.logoutHandler} >logout</button>
                            </li>
                            <li 
                                className = "menuList">
                                    <button name = 'logoutall' onClick = {this.logoutHandler}>logout from all devices</button>
                            </li>
                            <li 
                                className = "menuList">
                                    <button className = "AccountDelete" onClick = {this.deleteAccountHandler}>delete account</button>
                            </li>
                            <li 
                                className = "menuList">
                                    <button className = "menuCloseBtn" onClick = {this.toggleHandler}>close menu</button>
                            </li>
                        </ul>
                    }
                </div>
                <div className="userName">
                    <h1>{this.state.user.name}</h1>
                </div>               
            </div>
            )
  
        return(
            <div className = 'MainContainer'>
                <Header>
                    {(this.state.userLoaded) ? UserInfo : ''}
                </Header>
                <div className="TaskContainer">
                    {(this.state.user.profileChange === true) ? 
                        <ProfileEdit 
                            handleProfileEdit = {this.handleProfileEdit}
                            username = {this.state.user.name}
                            email = {this.state.user.email}
                            profileSpinner = {this.state.profileSpinner}
                            handleProfileUpdate = {this.handleProfileUpdate}
                            handlePassword = {this.handlePassword}
                        />
                        : 
                        null
                    }
                    {(this.state.loading) ?
                         <div className = "loadingg"> Loading.... </div>:  
                         <Task 
                            user = {this.state.user} 
                            handleProfileEdit = {this.handleProfileEdit}
                            errorMessageHandler = {this.errorMessageHandler}
                        />}
                </div>
                {(Object.keys(this.state.messages).length > 0) && <ErrorComponent messages = {this.state.messages}/>}
                {(this.state.loading) ? ' ' : <Footer />}
            </div>
        )
    }
}
