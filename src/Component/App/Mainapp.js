import React from 'react';

import Task from './Task';
import Header from '../Home/Header';
import {getCookie, apiBaseLink} from '../../helper/helper';

export default class Mainapp extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            user: {
                name: '',
                _id: ''
            },
            loading: true
        }
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
            user.name = data.name
            parent.setState({
                user: user,
                loading: false
            })
        })
        .catch(error => console.log(error))
    }
    render(){
        return(
            <div className = 'MainContainer'>
                <Header />
                {(this.state.loading) ? '..loading' :  <Task user = {this.state.user}/>}
            </div>
        )
    }
}
