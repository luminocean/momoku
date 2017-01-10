import dispatcher from '../dispatcher';
import EventEmitter from 'events';
import config from '../config';

/**
 * Data convention:
 * - 0 for no chess
 * - 1 for black chess or black to move
 * - 2 for white chess or white to move
 * - 3 for black wins
 * - 4 for white wins
 * - 5 for even
 */
class ChessStore extends EventEmitter{
    constructor(props){
        super(props);

        this.prefix = 'CHESS_';
        this.state = {};

        // init chess board data
        let data = [];
        for(let i=0; i<config.shape.height; i++){
            let row = [];
            for(let j=0; j<config.shape.width; j++){
                row.push(0); // init with all 0s
            }
            data.push(row);
        }
        this.state.data = data;
        this.state.progress = 1;

        dispatcher.register(this.onDispatch.bind(this));
    }

    onDispatch(payload){
        let type = payload.type;
        if(!type.startsWith(this.prefix)) return;

        let command = type.substring(this.prefix.length);
        if(command === 'MOVE'){
           this.move(payload.row, payload.col)
        }
    }

    getChessData(){
        return this.state.data;
    }

    // simulates a state machine
    move(row, col){
        let data = this.state.data;
        let progress = this.state.progress;

        let currentChess = data[row][col];
        // cell already taken, invalid
        if( currentChess > 0 ){
            return this.emit('ALREADY_TAKEN', {row, col});
        }

        // move
        data[row][col] = progress;
        // swtich to next mover
        this.state.progress = progress === 1 ? 2 : 1;

        this.emit('REFRESH', this.state.data);
    }
}

export default new ChessStore();
