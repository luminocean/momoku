import React from 'react';
import uuid from 'uuid/v4';
import config from '../config'
import Cell from './Cell';
import './ChessBoard.scss';

export default class ChessBoard extends React.Component{
    constructor(props){
        super(props);

        this.state = {};

        let data = [];
        for(let i=0; i<config.shape.height; i++){
            let row = [];
            for(let j=0; j<config.shape.width; j++){
                row.push(0); // init with all 0s
            }
            data.push(row);
        }
        this.state.data = data;
    }

    render(){
        return (
            <div className="chess-board">
                {this.generateRows(config.shape).map((row) => row)}
            </div>
        );
    }

    generateRows(shape){
        let rows = [];
        for(let i=0; i<shape.height; i++){
           rows.push(
               <div key={uuid()} className="chess-row">
                   {this.generateCells(shape.width, i).map((cell) => cell)}
               </div>
           );
        }
        return rows;
    }

    generateCells(width, row){
        let cells = [];
        for(let i=0; i<width; i++){
            cells.push(<Cell key={uuid()} datum={this.state.data[row][i]} row={row} col={i} />);
        }
        return cells;
    }
}
