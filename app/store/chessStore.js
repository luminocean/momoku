import dispatcher from '../dispatcher';
import EventEmitter from 'events';
import config from '../config';

/**
 * Data convention:
 * - 0 for no chess or game continuing
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

    getNextMover(){
        return this.state.progress;
    }

    // simulates a state machine
    move(row, col){
        // someone wins already
        if(this.state.progress >= 3) return;

        let data = this.state.data;
        let progress = this.state.progress;

        let currentChess = data[row][col];
        // cell already taken, invalid
        if( currentChess > 0 ){
            return this.emit('ALREADY_TAKEN', {row, col});
        }

        // move
        data[row][col] = progress;

        // see what's going
        let evaluation = this.isAnyoneWins(row, col);
        if(evaluation === 0) {
            // swtich to next mover
            this.state.progress = progress === 1 ? 2 : 1;
            this.emit('REFRESH', this.state.data);
        }else if(evaluation === 1 || evaluation === 2){
            // mark that someone wins
            this.state.progress = evaluation + 2;
            // refresh even though someone wins
            // so that five in a row will show on the chess board
            this.emit('REFRESH', this.state.data);
            this.emit('WINS', evaluation);
        }
    }

    // evaluate the situation from the given start position
    // and gives an evaluation result
    isAnyoneWins(row, col){
        let data = this.state.data;
        let limit = config.rules.limit;
        let mover = data[row][col];

        let plans = [[1,0], [0,1], [1,1]];
        let poses = [-4,-3,-2,-1,0,1,2,3,4];

        let n = 0; // how many same moves in a line
        // try three directions
        for(let i=0; i<plans.length; i++){
            let plan = plans[i];

            let max = 0;
            for(let j=0; j<poses.length; j++){
                let pos = poses[j];

                // position used to test
                let r = row + plan[0] * pos;
                let c = col + plan[1] * pos;
                if(!this.isValidPosition(r, c)) continue;

                if(data[r][c] === mover){
                    n += 1;
                    if( n > max ){
                        max = n;
                        // we have a winner
                        if( max === limit ) return mover;
                    }
                }else{
                    n = 0;
                }
            }
        }

        return 0;
    }

    isValidPosition(row, col){
        let {width, height} = config.shape;
        return 0 <= row && row < height && 0 <= col && col < width;
    }
}

export default new ChessStore();
