import React, { Component } from 'react'
import {TextField, Button,CircularProgress} from '@material-ui/core'

export default class ProfileEdit extends Component {
    render() {
        const BtnStyle = {
            background: '#1976D2'
        }
        const BtnStyleGreen = {
            background: '#52d869'
        }
        return (
            <div className ='profileEditContainer'>
                <form onSubmit = {(e) => {this.props.handleProfileUpdate(e)}}>
                    <TextField
                        fullWidth
                        disabled
                        label="User_name"
                        defaultValue = {this.props.username}
                        variant="outlined"
                        className = "UserInput"
                    />
                      <TextField
                        fullWidth
                        disabled
                        defaultValue = {this.props.email}
                        label="Email"
                        variant="outlined"
                        className = "UserInput"
                    />
                    <TextField
                        fullWidth
                        name = "password"
                        label="New Password"
                        variant="outlined"
                        type = "password"
                        className = "UserInput"
                        onChange = {(e) => {this.props.handlePassword(e)}}
                    />
                    <TextField
                        name = 'conformPassword'
                        fullWidth
                        label="Conform-New-Password"
                        variant="outlined"
                        type = "password"
                        className = "UserInput"
                        onChange = {(e) => {this.props.handlePassword(e)}}
                    />
                    <div className="addTaskEffectSpin">
                        <Button
                            type = "submit"
                            style = {BtnStyleGreen}
                            variant="contained"
                            color = "primary" 
                            onClick= {(e) => {this.props.handleProfileUpdate(e)}}
                            disabled = {this.props.profileSpinner}
                        >
                            save
                        </Button>
                        {(this.props.profileSpinner === true) ? <CircularProgress className = "addTaskSpinnerSpin"/>: null}
                    </div>
                    <Button
                        style = {BtnStyle}
                        variant="contained"
                        color = "primary" 
                        onClick= {(e) => {this.props.handleProfileEdit(e)}}
                    >
                        close
                    </Button>
                </form>
            </div>
        )
    }
}


