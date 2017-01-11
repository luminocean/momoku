import React from 'react';
import chessStore from '../store/chessStore';
import config from '../config'

import './Status.scss'

export default class Status extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            message: '',
            next: chessStore.getNextMover()
        };

        chessStore.on('ALREADY_TAKEN', this.showAlreadyTaken.bind(this));
        chessStore.on('REFRESH', this.refresh.bind(this));
        chessStore.on('WINS', this.wins.bind(this));
    }

    render() {
        return (
            <div className="chess-status">
                <span>{this.state.message}</span>
            </div>
        );
    }

    showAlreadyTaken({row, col}) {
        let message = `Oh, the cell at [${row + 1},${col + 1}] has been taken.`;
        this.setState({message, next: chessStore.getNextMover()});
    }

    refresh() {
        this.setState({message: '', next: chessStore.getNextMover()});
    }

    wins(mover){
        let message = `Winner is the ${config.movers[mover].name}!`;
        this.setState({message, next: 0});
    }
}
