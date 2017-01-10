import React from 'react';
import uuid from 'uuid/v4';
import {move} from '../action/chessAction';

export default class Cell extends React.Component{
    constructor(props){
        super(props);
    }

    render(){
        return (
            <span key={uuid()} className="chess-cell" onClick={this.onClick.bind(this)}>
                {this.datum2sign(this.props.datum)}
            </span>
        );
    }

    datum2sign(datum){
        if( datum === 1 ) return '\u25CB';
        if( datum === 2 ) return '\u25CF';
        return '';
    }

    onClick(){
        if( this.props.row === undefined || this.props.col === undefined )
            return;

        move(this.props.row, this.props.col);
    }
}

