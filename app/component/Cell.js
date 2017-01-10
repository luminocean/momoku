import React from 'react';
import uuid from 'uuid/v4';

export default class Cell extends React.Component{
    constructor(props){
        super(props);
        this.state = {};

        this.state.sign = '';
    }

    render(){
        return (
            <span key={uuid()} className="chess-cell" onClick={this.onClick.bind(this)}>
                {this.state.sign}
            </span>
        );
    }

    onClick(){
       console.log(this.props.row, this.props.col);
    }
}

