import config from './config';

export function array2DShape(array){
    let h = array.length;
    if( array[0] === undefined ){
        console.log("!");
    }
    let w = array[0].length;
    return [w, h];
}

export function isValidPosition(row, col){
    let {width, height} = config.shape;
    return 0 <= row && row < height && 0 <= col && col < width;
}

export function loopThrough2DArray(array, callback, filter = () => true){
    let h = array.length;
    if( array[0] === undefined ) return;

    let w = array[0].length;
    for(let i=0; i<h; i++){
        for(let j=0; j<w; j++){
            if( !filter(array[i][j]) ) continue;
            callback(i, j, array[i][j]);
        }
    }
}

export function mapLoop(length, callback){
    let results = [];
    for(let i=0; i<length; i++) results.push(callback(i));
    return results;
}

export function stopForDebug(square){
    let filter = (square, r, c) => {
        return square[r][c] !== 0 && square[r][c+1] !== undefined && square[r][c+1] !== 0;
    };

    let count = 0;
    loopThrough2DArray(square, (r, c) => {
        if( filter(square, r, c) ) count++;
    }, (datum) => datum !== 0);

    return count >= 3;
}