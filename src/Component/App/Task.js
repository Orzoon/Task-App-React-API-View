import React, {Component} from 'react';
import '../../css/task.scss'


class TaskList extends Component {
    render(){
        return(
            <div className="taskHeader">
                <li>
                    <button className="edit">edit</button>
                    <button className = "delete">delete</button> 
                    <div className="task">
                        some task informain
                    </div>
                </li>
            </div>
        )
    }
}

export default class Task extends Component {
    
    render(){
        return (
            <div className="taskContainer">
               <ul>
                    <TaskList />
               </ul>
            </div> 
        )
    }
}