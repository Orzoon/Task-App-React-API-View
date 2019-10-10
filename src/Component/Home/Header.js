import React from 'react';
import "../../css/header.scss";


const Logo = (props) => {
    return (
        <div className="logoContainer">
            {props.logo}
        </div>
    )
}


export default class Header extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            logo: 'Task App'
        }
    }
    componentDidMount(){
        console.log('2')
    }
    render(){
        console.log('render2')
        return(
            <div className="headerContainer">
            <Logo logo = {this.state.logo} />
        </div>
        )
    }
}


