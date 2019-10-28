import React from 'react';
import "../../css/header.scss";

//Icons


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
        
    }
    render(){
     
        return(
            <div className ="headerWrapper">
             <div className="headerContainer">
                <Logo logo = {this.state.logo} />
                {this.props.children}
             </div>
            </div>
        )
    }
}


