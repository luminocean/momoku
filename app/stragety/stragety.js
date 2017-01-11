import evaluate from './evaluate'
import * as util from '../utility'
import config from '../config'

const negativeLoss = 1;
const centerPos = {
    row: config.shape.height/2,
    col: config.shape.width/2
};

// evaluate the point of a certain position
const evaluateMove = (data, row, col, mover) => {
    let cellCopy = data[row][col];

    // positive search
    data[row][col] = mover;
    let positivePoint = evaluate(data, row, col, mover);

    // negative search
    let oppositeMover = mover === 1 ? 2:1; // switch
    data[row][col] = oppositeMover;
    let negativePoint = evaluate(data, row, col, oppositeMover) - negativeLoss;

    data[row][col] = cellCopy; // recover
    // return the higher one
    return positivePoint >= negativePoint ? positivePoint : negativePoint;
};

const distance2center = (pos) => {
  return Math.sqrt(Math.pow(pos.row-centerPos.row, 2) + Math.pow(pos.col-centerPos.col, 2));
};


export function think(data, mover){
    let moves = [];

    // only go through empty cell
    util.loopThrough2DArray(data, (datum) => datum === 0, (row, col) => {
        let point = evaluateMove(data, row, col, mover);
        moves.push({row, col, point});
    });

    // reverse order, higher points and nearer to center first
    moves.sort((a, b) => {
        if((b.point - a.point) !== 0) return b.point - a.point;
        return 1/(1+distance2center(b)) - 1/(1+distance2center(a));
    });

    // init move if all are empty
    if(moves.filter((move) => move.point !== 0).length === 0 ){
        return {row: 7, col: 7};
    }

    let firstChoices = moves.filter((move) => move.point === moves[0].point);
    let choice = firstChoices[parseInt(Math.random() * firstChoices.length)]

    // make move
    return {
        row: choice.row,
        col: choice.col
    }
}