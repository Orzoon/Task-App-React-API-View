import React from 'react';
import {Button, CircularProgress, TextField} from '@material-ui/core';


const CreateTask = (props) => {
    const BtnStyle = {
        background: '#1976D2'
    }
    
    return (
        <div className = 'createTaskContainer'>
            <form onSubmit = {(e) => {props.addTask(e)}}>
                <TextField
                label = "Enter your new task"
                autoFocus = {true}
                fullWidth
                variant="outlined"
                onChange = {(e) => {props.createTask(e)}}
                value={props.createDescription}
                name ="createDescription" 
                type='text' 
                className = "labelInput"
                />
                 <div className="addTaskEffect">
                    <Button
                        style = {BtnStyle}
                        variant="contained"
                        color = "primary" 
                        onClick= {(e) => {props.addTask(e)}}
                        disabled = {props.buttonDisable}>
                        create new task 
                    </Button>
                    {props.buttonDisable && <CircularProgress className = "addTaskSpinner"/>}
                 </div>
            </form>
        </div>
    )
}

export default CreateTask;