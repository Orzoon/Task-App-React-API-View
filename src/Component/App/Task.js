import React, {Component} from 'react';
import TaskList from './TaskList'
import CreateTask from './CreateTask'
import '../../css/task.scss'
import {apiBaseLink,getCookie} from '../../helper/helper'
import {CSSTransitionGroup} from 'react-transition-group'
import {Paper,Tabs,Tab } from '@material-ui/core'

export default class Task extends Component {
    constructor(props){
        super(props);
        this.inputRef = React.createRef();
        this.state = {
            tasks: [],
            createDescription: '',
            buttonDisable: false,
            tasksCount: null,
            currentCount: 0,
            limit: 5,
            skip: 0,
            tabIndexValue: 0,
            loading: true,
            editTaskIndicator: false

        }
        this.deleteTask = this.deleteTask.bind(this)
        this.createTaskHandler = this.createTaskHandler.bind(this)
        this.addTask = this.addTask.bind(this)
        this.editTask = this.editTask.bind(this)
        this.editTaskHandler = this.editTaskHandler.bind(this)
        this.saveEditHandler = this.saveEditHandler.bind(this)
        this.handleTaskSwitchStatus =this.handleTaskSwitchStatus.bind(this)
        this.handleTabFilter = this.handleTabFilter.bind(this)
    }
    componentDidMount(){
        const parent = this;
        const token = getCookie('token')
        fetch(apiBaseLink + '/tasks/count', {
            method: 'GET',
            headers: {
                'authorization' : `Bearer ${token}`
            }
        })
        .then(response => response.json())
        .then(data => {
            let count = data.count
            parent.setState({
                tasksCount: count
            })
        })
        .catch(error => console.log(error))

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
                value.switchLoading = false
                return value
            })
            parent.setState({
                tasks: data,
                loading: false
            })
        })
        .catch(error => console.log(error))
    }
    deleteTask(e){
        e.preventDefault();
        const id = e.currentTarget.value;
        const parent = this;
        const token = getCookie('token')
        fetch(apiBaseLink + `/tasks/${id}`, {
            method: 'DELETE',
            headers: {
                'authorization': `Bearer ${token}`
            }
        })
        .then(response => {
            console.log('response', response)
           return response.json()})
        .then(data => {
            const _id = data._id;
            let tasksUpdated = [...parent.state.tasks]
            tasksUpdated = tasksUpdated.filter((item) => {
                return item._id !== _id
            })
            parent.setState({
                tasks: [...tasksUpdated],
                tasksCount: this.state.tasksCount - 1
            })
            parent.props.errorMessageHandler('add', 'successMessage', 'Task successfully deleted!!')
        })
        .catch(error => console.log(error))
    }
    createTaskHandler(e){
        e.preventDefault();
        const name = e.target.name;
        const value = e.target.value;
        this.setState({
            [name]: value
        })
    }
    addTask(e){
        e.preventDefault();
        const parent = this;
        this.setState({
            buttonDisable: !this.state.buttonDisable
        })
        let task = this.state.createDescription.toString();
        if(task !=='' && task.length > 0){
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
                createDescription:'',
                buttonDisable: !parent.state.buttonDisable,
                tasksCount: this.state.tasksCount + 1,
                tabIndexValue: 0
               })
               parent.props.errorMessageHandler('add', 'successMessage', 'Task successfully added!!')
           })
           .catch(error => console.log(error))
        }
        else{
            this.setState({
                buttonDisable: false
            })
           this.props.errorMessageHandler('add', 'errorMessage', 'Empty Task!!')
        }
        
    }
    editTask(e){
        e.preventDefault();
        const _id = e.currentTarget.value;
        const tasksCopy =[...this.state.tasks] 
        const index = tasksCopy.findIndex(item => item._id === _id)
        tasksCopy[index].editMode = true;
        this.setState({
            tasks: [...tasksCopy]
        })
    }
    editTaskHandler(e,_id){
        let name = e.currentTarget.name;
        const value = e.currentTarget.value;
        const tasksCopy = [...this.state.tasks]
        const index = tasksCopy.findIndex(item => item._id === _id);
        tasksCopy[index][name] = value
        this.setState({
            tasks: [...tasksCopy]
        })
    }
    saveEditHandler(e){
        e.preventDefault();
        const _id = e.currentTarget.value;
        let name = e.currentTarget.name;
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
            parent.props.errorMessageHandler('add', 'successMessage', 'Task successfully updated!!')
        }) //probly set state of this specific task again
        .catch(error => console.log(error))
    }
    handleTaskSwitchStatus(e,id,statusName){
      let nextValue = e.target.value;
      const trueCheck = (nextValue.toLowerCase() === 'true')
      const name = statusName;
      const _id  = id;
      const arrayCopy = [...this.state.tasks];
      let index = arrayCopy.findIndex(item => item._id === _id)
      let item = {...arrayCopy[index]}
        item[name] = trueCheck
        item.switchLoading = true;
        arrayCopy[index] = item;
        this.setState({
            tasks: arrayCopy
        })
        const data = {
            completed: trueCheck
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
       .then(response => {
           if(!response.status === 200){
            item = {...arrayCopy[index]}
            item[name] = !trueCheck
            item.switchLoading = false;
            arrayCopy[index] = item;
            parent.setState({
                tasks: arrayCopy
            })
           }
           return response.json()
       })
       .then(data => {
           data.switchLoading = false;
           arrayCopy[index] = data;
           if(parent.state.tabIndexValue === 0){
             parent.setState({
                tasks: [...arrayCopy]
                   //also set the change of that swtich here by mapping
               })
           }
           else{
               parent.fetchDataHandler(parent.state.tabIndexValue)
           }
       })
       .catch(error => console.log(error))

       
    }
    handleTabFilter(e,tabValue){
        
        if(tabValue === this.state.tabIndexValue){
            return
        }
        this.setState({
            tabIndexValue: tabValue,
            loading: true
        })
        this.fetchDataHandler(tabValue);
    }
    fetchDataHandler(tabValue){
        let fetchBaseFilter;
        const token = getCookie('token')
        switch(tabValue){
            case 0:
                fetchBaseFilter = `${apiBaseLink}/tasks?sortby=createdAt_desc`;
                break;
            case 1: 
                fetchBaseFilter = `${apiBaseLink}/tasks?sortby=createdAt_desc&completed=true`;
                break;
            case 2: 
                fetchBaseFilter = `${apiBaseLink}/tasks?sortby=createdAt_desc&completed=false`;
                break;
        }
        const parent = this;
        let count;
        fetch(apiBaseLink + '/tasks/count', {
                method: 'GET',
                headers: {
                    'authorization' : `Bearer ${token}` 
                }
               
                }      
            )
            .then(response => response.json())
            .then(countno => {
                    count = countno
                    return fetch(fetchBaseFilter, {
                        method: 'GET',
                        headers: {
                        'authorization' : `Bearer ${token}` 
                    }
                })
            })
            .then(response => response.json())
            .then(data => {
                parent.setState({
                    tasks: data,
                    count: count,
                    loading: false
                })
            })
            .catch(error => console.log(error));

       
    }
    render(){
        const {tasks} = this.state;
        return (
            <React.Fragment>
                <CreateTask 
                    createTask = {this.createTaskHandler} 
                    addTask = {this.addTask}
                    buttonDisable = {this.state.buttonDisable}
                    createDescription = {this.state.createDescription}
                /> 
              <ul>
              {/* //<li className = 'filterTab' > */}
              <Paper className = 'filterTab'>
                <li>
                    <Tabs
                        value= {this.state.tabIndexValue}
                        onChange={this.handleTabFilter}
                        TabIndicatorProps={
                            {
                                style: {
                                    background: '#1976D2'
                                }
                            }
                        }
                        textColor="inherit"
                        centered
                        >
                            <Tab label="All" />
                            <Tab label="Completed" />
                            <Tab label="Incomplete" />
                    </Tabs>
                </li>
            </Paper>
              {/* //</li> */}
              <CSSTransitionGroup
                    transitionName="example"
                    transitionEnterTimeout={500}
                    transitionLeaveTimeout={300}>
                {(() => {
                    if(tasks.length !== 0 && this.state.loading === false){
                        return tasks.map((item, i) => {
                            return <TaskList 
                                            ref = {this.inputRef}
                                            key ={item._id} 
                                            task = {item} 
                                            deleteTask={this.deleteTask} 
                                            editTask = {this.editTask}
                                            editTaskHandler = {this.editTaskHandler}
                                            saveEditHandler = {this.saveEditHandler}
                                            handleTaskSwitchStatus = {this.handleTaskSwitchStatus}
                                            editTaskIndicator= {this.state.editTaskIndicator}
                                        />
                        })
                        }
                        else if(this.state.loading === true){
                            return <li className = "empty loading">Loading............</li>
                        }
                        else if((this.state.tasks.length === 0 && this.state.tabIndexValue === 1)){
                            //set if not task data
                          //return <li className = "empty">no task to display, create one</li> 
                          return <li className = "empty">not a single completed Task!!</li>
                        }
                        else if((this.state.tasks.length === 0 && this.state.tabIndexValue === 2)){
                         return <li className = "empty">not a single incomplete Task!!</li>
                        }
                        else if(this.state.tasks.length === 0 && this.state.loading === false){
                            return <li className = "empty">no task to display, create one</li> 
                        }
                })()}
                </CSSTransitionGroup>
              </ul>
            </React.Fragment>
        )
    }
}