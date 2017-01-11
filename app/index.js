import React from 'react';
import ReactDOM from 'react-dom';
import ChessBoard from './component/ChessBoard';
import Status from './component/Status';
import Control from './component/Control'
import {AIMove} from './action/chessAction'

import './index.scss'

let app = (
    <div id="app">
        <Status/>
        <ChessBoard/>
        <Control/>
    </div>
);
ReactDOM.render(app, document.getElementById('root'));

// binding global key events
document.onkeypress = (e) => {
    // A -> run AI program
    if(e.code === 'KeyA') AIMove();
};