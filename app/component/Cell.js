import React from 'react';
import uuid from 'uuid/v4';
import config from '../config'
import {move} from '../action/chessAction';
import './Cell.scss'

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
        let movers = config.movers;
        if( datum === 1 ) return movers[datum].icon;
        if( datum === 2 ) return movers[datum].icon;
        return '';
    }

    onClick(){
        if( this.props.row === undefined || this.props.col === undefined )
            return;

        move(this.props.row, this.props.col);
    }
}

