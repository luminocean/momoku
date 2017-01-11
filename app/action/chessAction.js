import dispatcher from '../dispatcher';

export function move(row, col){
    dispatcher.dispatch({
        type: 'CHESS_MOVE', row, col
    });
}

export function AIMove(){
    dispatcher.dispatch({
        type: 'CHESS_AI_MOVE'
    })
}