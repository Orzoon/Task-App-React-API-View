import React from 'react';
import {Button,Typography, Paper, Switch, LinearProgress,CircularProgress} from '@material-ui/core';
import {Edit, Delete,Save} from '@material-ui/icons';

import {withStyles} from '@material-ui/core/styles';

const MySwitch = withStyles({
    switchBase: {
        color: 'red',
        '&$checked': {
          color: '#52d869'
        },
        '&$checked + $track': {
          backgroundColor: '#52d869'
        },
      },
      checked: {},
      track: {
        backgroundColor: "red",
        opacity: .5
      },
})(Switch);

const EditTask = (props) => {
    return (<textarea className = 'textarea'
                name = "description"
                id="" 
                cols="" 
                rows=""
                test = "test"
                onChange = {(e) => {props.editTaskHandler(e, props.taskId)}}
                defaultValue = {props.description} />  )
}




class TaskList extends React.Component {
    constructor(props){
        super(props);
    }
    render()
        {   

            const listAnimationClasses = 'listPaper'


            const BtnStyle = {
                background: '#1976D2',
                color: '#fff'
            }
            const {editMode, _id,description, completed, switchLoading} = this.props.task;
            const {saveEditHandler, editTask, deleteTask,editTaskHandler,handleTaskSwitchStatus} = this.props;

        return (
        <Paper className = {listAnimationClasses} square = {true} >
            <div className = 'linearProgress'>{switchLoading &&<LinearProgress />}</div>      
                 <li className = "taskListHeader">
                    <div className="taskSwitchStatus">
                        <MySwitch 
                            checked = {completed}
                            value = {!completed}
                            onChange = {(e) => {handleTaskSwitchStatus(e,_id,'completed')}}
                        />
                        {(!switchLoading)  && <React.Fragment>{(completed) ? 'completed' : 'incomplete'}</React.Fragment>}
                    </div>
                    <div className="taskDescriptionContainer">
                        {   (editMode) ? 
                            <EditTask 
                                description = {description} 
                                editTaskHandler ={editTaskHandler}
                                taskId = {_id}
                            />:
                            <div className="taskDescription">
                         
                                <Typography variant="body1" display="block" gutterBottom>
                                {description}
                                </Typography>
                            </div> 

                        }
                    </div>
                    <div className="taskButtonContainer">
                        {(editMode) ? 
                            <Button 
                                style = {BtnStyle}
                                startIcon = {<Save />}
                                variant="contained"
                                name = "description"
                                className="taskButtons" 
                                value ={_id}
                                onClick = {(e) => {saveEditHandler(e)}}>save
                            </Button>
                            :
                            <Button
                                style = {BtnStyle}
                                startIcon = {<Edit />}
                                variant="contained"
                                className="taskButtons" 
                                value ={_id} 
                                onClick= {(e) => {editTask(e)}}>
                                 {(!this.props.editTaskIndicator) ? 'edit' : <CircularProgress className = "addTaskSpinner"/>}   
                            </Button>
                        }
                        <Button
                            color = "secondary"
                            startIcon = {<Delete />}
                            variant="contained"
                            className="taskButtons" 
                            value ={_id}
                            onClick = {(e) => {deleteTask(e)}}>delete
                        </Button> 
 
                    </div>
                </li>
         </Paper>
            )
        }
}

export default TaskList;