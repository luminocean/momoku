import * as util from '../utility'
import patterns from './patterns'

const cropSquare = (data, row, col, radius) => {
    let square = [];

    for(let r = row-radius; r <= row+radius; r++){
        let line = [];
            for(let c = col-radius; c <=col+radius; c++){
            if(!util.isValidPosition(r, c)) continue;

            line.push(data[r][c]);
        }
        if( line.length > 0) square.push(line);
    }
    return square;
};

const convertView = (square, mover) => {
    if( mover === 1 ) return square; // no need to convert for mover 1

    util.loopThrough2DArray(square, (r, c) => {
        if( [1,2].indexOf(square[r][c]) !== -1 ){
            square[r][c] = square[r][c] === 1 ? 2:1;
        }
    });
    return square;
};

const patternMatches = (pivotX, pivotY, square, pattern) => {
    let patternShape = util.array2DShape(pattern);
    for(let i=0; i<patternShape[1]; i++){
        for(let j=0; j<patternShape[0]; j++){
            let patternDatum = pattern[i][j];
            if( patternDatum === 9 ) continue;
            if(patternDatum !== square[pivotY+i][pivotX+j]) return false;
        }
    }
    return true;
};

const comparePatternsInSquare = (square, patterns) => {
    let maxPoint = 0;

    // square shape
    let ss = util.array2DShape(square);
    patterns.forEach(({pattern, point}) => {
        // pattern shape
        let ps = util.array2DShape(pattern);

        for(let x=0; x<=ss[0]-ps[0]; x++){
            for(let y=0; y<=ss[1]-ps[1]; y++){
                if( patternMatches(x, y, square, pattern) ){
                    if( point > maxPoint ) maxPoint = point;
                }
            }
        }
    });

    return maxPoint;
};

// clockwise
const rotate = (square) => {
    let shape = util.array2DShape(square);
    let mat = [];

    for(let x=0; x<shape[0]; x++){
        let column = [];
        for(let y=shape[1]-1; y>=0; y--){
            column.push(square[y][x]); // be careful here
        }
        mat.push(column);
    }

    return mat;
};

export default function evaluate(data, row, col, mover){
    let square = cropSquare(data, row, col, 4); // take a radius of 4

    if(util.stopForDebug(square)){
        console.log("a stop");
    }

    convertView(square, mover);

    let point = 0;
    // rotate square 4 times
    let count = 0;
    do{
        let p = comparePatternsInSquare(square, patterns);
        if( p > point ) point = p;
        rotate(square);
    }while(++count < 4);

    return point;
}