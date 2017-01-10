import React from 'react';
import chessStore from '../store/chessStore';
import Cell from './Cell';
import './Status.scss'

export default class Status extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};

        chessStore.on('ALREADY_TAKEN', this.showAlreadyTaken.bind(this));
        chessStore.on('REFRESH', this.refresh.bind(this));
    }

    render() {
        return (
            <div className="chess-status">
                <span>Next: </span>
                <Cell datum={this.state.next}/>
                <span> </span>
                <span>{this.state.message}</span>
            </div>
        );
    }

    showAlreadyTaken({row, col}) {
        let message = `Oh, the cell at [${row + 1},${col + 1}] has been taken.`;
        this.setState({message, next: chessStore.getNextMover()});
    }

    refresh() {
        let message = '';
        this.setState({message, next: chessStore.getNextMover()});

        console.log(chessStore.getNextMover());
    }
}
