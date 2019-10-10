import React, {Component} from 'react'
import Task from './Task'
import "../../css/body.scss";


//-----------------------SIDEINFORMATION COMPONENT
const SideInformation = (props) => {
    return (<div className="sideInformtion">
                <div className="itemSi">{props.sideInformation.totalTask}</div>
                <div className="itemSi">{props.sideInformation.completedTask}</div>
                <div className="itemSi">{props.sideInformation.incompleteTask}</div>
             </div>)
}




export default class Body extends Component {
    constructor(props){
        super(props);
        this.state = {
            sideInformation: {
                totalTask: 0,
                completedTask: 4,
                incompleteTask: 6
            },
            tasks: null
        }
    }
    render (){
        return (
            <div className = "bodyContainer">
                <SideInformation sideInformation = {this.state.sideInformation}/>
                <Task />
            </div>
        )
    }
}