import React from 'react';
import uuid from 'uuid/v4';
import classNames from 'classnames';
import config from '../config'
import {move} from '../action/chessAction';
import './Cell.scss'

export default class Cell extends React.Component{
    constructor(props){
        super(props);
    }

    render(){
        return (
            <span key={uuid()} onClick={this.onClick.bind(this)}
                  className={classNames({"chess-cell": true, "last-cell": this.props.isLast})} >
                {this.datum2sign(this.props.datum)}
            </span>
        );
    }

    datum2sign(datum){
        let movers = config.movers;
        if( [1,2].indexOf(datum) !== -1 ) return movers[datum].icon;
        return '';
    }

    onClick(){
        if( this.props.row === undefined || this.props.col === undefined )
            return;

        move(this.props.row, this.props.col);
    }
}

