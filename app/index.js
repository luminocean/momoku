import React from 'react';
import ReactDOM from 'react-dom';
import ChessBoard from './component/ChessBoard';
import Status from './component/Status';
import Control from './component/Control'
import './index.scss'

let app = (
    <div id="app">
        <Status/>
        <ChessBoard/>
        <Control/>
    </div>
);
ReactDOM.render(app, document.getElementById('root'));