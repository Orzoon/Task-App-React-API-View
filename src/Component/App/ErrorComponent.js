import React from 'react';
import '../../css/error.scss';

export default class ErrorComponent extends React.Component{
    render(){
        const {messages} = this.props;
        const messageArray = Object.keys(messages);
        let backgroundColor;
        if(messageArray[0] === 'errorMessage'){
            backgroundColor = '#D32F2F'
        }
        else if(messageArray[0] === 'warningMessage'){
            backgroundColor = '#FFA000'
        }
        else if (messageArray[0] === 'successMessage'){
            backgroundColor = '#43A047' 
        }
        
        return (
            <div className = "errorComponent" style = {{
                backgroundColor: backgroundColor
            }}>
                    {messages[messageArray[0]]}
            </div>
        )
    }
}