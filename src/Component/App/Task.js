import React, {Component} from 'react';
import '../../css/task.scss'


import {apiBaseLink,getCookie} from '../../helper/helper'

const CreateTask = (props) => {
    return (
        <div>
            <form >
                 <input 
                    type='text' 
                    name ="createDescription" 
                    onChange = {(e) => {props.createTask(e)}} />
                 <button 
                    onClick= {(e) => {props.addTask(e)}}>addTask
                </button>
            </form>
        </div>
    )
}

const EditTask = (props) => {
    return (<textarea name="textArea" 
                name = 'description'
                id="" 
                cols="" 
                rows=""
                test = "test"
                onChange = {(e) => {props.editTaskHandler(e, props.taskId)}}
                defaultValue = {props.description} />  )
}
class TaskList extends Component {
    render()
        {
        return (
                <li className = "taskHeader">
                    <button 
                        className="edit" 
                        value ={this.props.task._id} 
                        onClick= {(e) => {this.props.editTask(e)}}>edit
                    </button>
                    <button 
                        className = "delete"  
                        value ={this.props.task._id}
                        onClick = {this.props.deleteTask}>delete
                    </button> 
                    <button 
                        name = "description"
                        className = "save"  
                        value ={this.props.task._id}
                        onClick = {this.props.saveEditHandler}>save
                    </button>
                    <div className="descriptionContainer">
                        {   (this.props.task.editMode) ? 
                            <EditTask 
                                description = {this.props.task.description} 
                                editTaskHandler ={this.props.editTaskHandler}
                                taskId = {this.props.task._id}
                            />:
                            <div className="taskDescription">
                                {this.props.task.description}
                            </div> 
                        }
                    </div>
                </li>
            )
        }
}

export default class Task extends Component {
    constructor(props){
        super(props)
        this.state = {
            tasks: '',
            createDescription: '' 
        }
        this.deleteTask = this.deleteTask.bind(this)
        this.createTaskHandler = this.createTaskHandler.bind(this)
        this.addTask = this.addTask.bind(this)
        this.editTask = this.editTask.bind(this)
        this.editTaskHandler = this.editTaskHandler.bind(this)
        this.saveEditHandler = this.saveEditHandler.bind(this)
    }
    componentDidMount(){
        const parent = this;
        const token = getCookie('token')
        fetch(apiBaseLink + '/tasks?sortby=createdAt_desc', {
            method: 'GET',
            headers: {
                'authorization' : `Bearer ${token}`
            }
        })
        .then(response => response.json())
        .then(data => {
            data = data.map((value) => {
                value.editMode = false
                return value
            })
            parent.setState({
                tasks: data
            })
        })
        .catch(error => console.log(error))
    }
    deleteTask(e){
        e.preventDefault();
        const id = e.target.value;
        const parent = this;
        const token = getCookie('token')
        fetch(apiBaseLink + `/tasks/${id}`, {
            method: 'DELETE',
            headers: {
                'authorization': `Bearer ${token}`
            }
        })
        .then(response => response.json())
        .then(data => {
            const _id = data._id;
            let tasksUpdated = [...parent.state.tasks]
            tasksUpdated = tasksUpdated.filter((item) => {
                return item._id !== _id
            })
            parent.setState({
                tasks: [...tasksUpdated]
            })
        })
        .catch(error => console.log(error))
    }
    createTaskHandler(e){
        const name = e.target.name;
        const value = e.target.value;
        this.setState({
            [name]: value
        })
    }
    addTask(e){
        e.preventDefault();
        const parent = this;
        let task = this.state.createDescription.toString();
        console.log(typeof(task))

        if(!task == ''){
           let data = {
               description: this.state.createDescription
           }
           const token = getCookie('token');
           fetch(apiBaseLink+`/tasks`, {
                method: 'POST',
                headers: {
                    'content-type': 'application/json',
                    'authorization': `Bearer ${token}`
                },
                body: JSON.stringify(data)
           })
           .then(response => response.json())
           .then(data => {
               parent.setState({
                tasks: [data,...parent.state.tasks],
                createDescription: ''
               })
           })
           .catch(error => console.log(error))
        }
        else{
            return console.log('taskis empty')
        }
        
    }
    editTask(e){
        e.preventDefault();
        const _id = e.target.value;
        const tasksCopy =[...this.state.tasks] 
        const index = tasksCopy.findIndex(item => item._id === _id)
        tasksCopy[index].editMode = true;
        this.setState({
            tasks: [...tasksCopy]
        })
    }
    editTaskHandler(e,_id){
        let name = e.target.name;
        const value = e.target.value;
        const tasksCopy = [...this.state.tasks]
        const index = tasksCopy.findIndex(item => item._id === _id);
        tasksCopy[index][name] = value
        this.setState({
            tasks: [...tasksCopy]
        })
    }
    saveEditHandler(e){
        e.preventDefault();
        const _id = e.target.value;
        let name = e.target.name;
        const tasksCopy = [...this.state.tasks]  
        let item = tasksCopy.filter(item => item._id === _id)
        item = {...item[0]}
        const data = {
            [name]: item[name]
        }
        const parent = this;
        const token = getCookie('token')
        fetch(apiBaseLink+`/tasks/${_id}`, {
            method: 'PATCH',
            headers: {
                'content-type': 'application/json',
                'authorization': `Bearer ${token}`
            },
            body: JSON.stringify(data)
       })
        .then(response => response.json())
        .then(data => {
            let index = tasksCopy.findIndex(item => item._id === data._id)
            tasksCopy[index] = data;
            tasksCopy[index].editMode = false;
            parent.setState({
                tasks: [...tasksCopy]
            })
        }) //probly set state of this specific task again
        .catch(error => console.log(error))
    }

    render(){
        const {tasks} = this.state;
        return (
            <div className="TaskContainer">
              {(tasks !== '' && tasks.length !== 0) ?
                <CreateTask 
                    createTask = {this.createTaskHandler} 
                    addTask = {this.addTask}
                /> : 
                null}
              <ul>
                {(() => {
                    if(tasks !== '' && tasks.length !== 0){
                        return tasks.map((item, i) => {
                            return <TaskList 
                                        key ={item._id} 
                                        task = {item} 
                                        deleteTask={this.deleteTask} 
                                        editTask = {this.editTask}
                                        editTaskHandler = {this.editTaskHandler}
                                        saveEditHandler = {this.saveEditHandler}
                                    />
                        })
                        }
                        else{
                            //set if not task data
                            console.log('not')
                        }
                })()}
              </ul>
                
            </div>
        )
    }
}