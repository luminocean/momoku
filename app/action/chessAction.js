import dispatcher from '../dispatcher';

export function move(row, col){
    dispatcher.dispatch({
        type: 'CHESS_MOVE', row, col
    });
}
