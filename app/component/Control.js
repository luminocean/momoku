import React from 'react';
import {AIMove} from '../action/chessAction'

export default class Control extends React.Component{
    render() {
        return (
            <div>
                <button onClick={AIMove}>AI</button>
            </div>
        );
    }
}