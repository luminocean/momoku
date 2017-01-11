import React from 'react';
import uuid from 'uuid/v4';
import config from '../config'
import Cell from './Cell';
import chessStore from '../store/chessStore';
import * as util from '../utility'

import './ChessBoard.scss'

export default class ChessBoard extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            data: chessStore.getChessData(),
            last: {}
        };

        // once the store fires a refresh event,
        // ChessBoard repaints everything
        chessStore.on('REFRESH', ({data, last}) => {
            this.setState({data, last});
        });
    }

    render(){
        return (
            <div className="chess-board">
                {util.mapLoop(config.shape.height, (row) =>
                    <div key={uuid()} className="chess-row">
                        {util.mapLoop(config.shape.width, (col) =>
                            <Cell key={uuid()} datum={this.state.data[row][col]} row={row} col={col}
                                  isLast={row === this.state.last.row && col === this.state.last.col} />
                        )}
                    </div>
                )}
            </div>
        );
    }
}
