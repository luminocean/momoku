import * as util from '../utility'

// create a matrix
const mat = (width, height, val) => {
    let matrix = [];
    for(let i=0; i<height; i++){
        let line = [];
        for(let j=0; j<width; j++){
            line.push(val);
        }
        matrix.push(line);
    }
    return matrix;
};

const coverOnMat = (matrix, template, pivotX, pivotY) => {
    util.loopThrough2DArray(template, (r, c) => {
        if(template[r][c] === 9) return; // skip cell of 9
        // cover
        matrix[pivotY+r][pivotX+c] = template[r][c];
    })
};

const flatten = (arr) => {
    const flat = [].concat(...arr);
    return flat.some(Array.isArray) ? flatten(flat) : flat;
};

const mixupPatterns = ({template1, yrange, template2, xrange, matParam}) => {
    let patterns = [];

    for(let y=yrange[0]; y<=yrange[1]; y++){
        let xr;
        if(xrange instanceof Function){
            xr = xrange(y);
        }else{
            xr = xrange;
        }

        for(let x=xr[0]; x<=xr[1]; x++){
            let matrix = mat(matParam.width, matParam.height, matParam.val);
            coverOnMat(matrix, template1, 0, y);
            coverOnMat(matrix, template2, x, 0);
            patterns.push(matrix);
        }
    }

    return patterns;
};

// 1 - self moves
// 2 - opposite moves or boundry
// 9 - doesn't care
const dictionary = [
    /**
     * full 5
     */
    {
        pattern: [[1,1,1,1,1]],
        point: 100
    },
    {
        pattern: [
            [1,9,9,9,9],
            [9,1,9,9,9],
            [9,9,1,9,9],
            [9,9,9,1,9],
            [9,9,9,9,1]
        ],
        point: 100
    },
    /**
     * live 4
     */
    {
        pattern: [[0,1,1,1,1,0]],
        point: 90
    },
    {
        pattern: [
            [0,9,9,9,9,9],
            [9,1,9,9,9,9],
            [9,9,1,9,9,9],
            [9,9,9,1,9,9],
            [9,9,9,9,1,9],
            [9,9,9,9,9,0]
        ],
        point: 90
    },
    /**
     * double dead 4
     */
    // orthogonally
    {
        pattern: [
            [1,1,1,1,0],
            [1,9,9,9,9],
            [1,9,9,9,9],
            [1,9,9,9,9],
            [0,9,9,9,9]
        ],
        point: 90,
        getPatterns: function() {
            return mixupPatterns({
                template1: [
                    [1,1,1,1,0]
                ],
                yrange: [0,3],
                template2: [
                    [1],
                    [1],
                    [1],
                    [1],
                    [0]
                ],
                xrange: [0, 3],
                matParam: {
                    width: 5,
                    height: 5,
                    val:9
                }
            });
        }
    },
    // diagonally
    {
        pattern: [
            [1,1,1,1,0],
            [9,1,9,9,9],
            [9,9,1,9,9],
            [9,9,9,1,9],
            [9,9,9,9,0]
        ],
        point: 90,
        getPatterns: function() {
            return mixupPatterns({
                template1: [
                    [1,1,1,1,0]
                ],
                yrange: [0,3],
                template2: [
                    [1,9,9,9,9],
                    [9,1,9,9,9],
                    [9,9,1,9,9],
                    [9,9,9,1,9],
                    [9,9,9,9,0]
                ],
                xrange: (yval) => [0, 3-yval],
                matParam: {
                    width: 8,
                    height: 5,
                    val:9
                }
            });
        }
    },
    /**
     * dead 4 and live 3
     */
    // loops
    {
        pattern: [
            [0,9,9,9,9],
            [1,1,1,1,0],
            [1,9,9,9,9],
            [1,9,9,9,9],
            [0,9,9,9,9]
        ],
        point: 90,
        getPatterns: function() {
            return mixupPatterns({
                template1: [
                    [1,1,1,1,0]
                ],
                yrange: [1,3],
                template2: [
                    [0],
                    [1],
                    [1],
                    [1],
                    [0]
                ],
                xrange: [0, 3],
                matParam: {
                    width: 5,
                    height: 5,
                    val:9
                }
            });
        }
    },
    {
        pattern: [
            [0,9,9,9,9],
            [1,1,1,1,0],
            [9,9,1,9,9],
            [9,9,9,1,9],
            [9,9,9,9,0]
        ],
        point: 90,
        getPatterns: function() {
            return mixupPatterns({
                template1: [
                    [1,1,1,1,0]
                ],
                yrange: [1,3],
                template2: [
                    [0,9,9,9,9],
                    [9,1,9,9,9],
                    [9,9,1,9,9],
                    [9,9,9,1,9],
                    [9,9,9,9,0]
                ],
                xrange: (yval) => [0, 3-yval],
                matParam: {
                    width: 7,
                    height: 5,
                    val:9
                }
            });
        }
    },
    /**
     * double live 3
     */
    // loop
    {
        pattern: [
            [9,0,9,9,9],
            [0,1,1,1,0],
            [9,1,9,9,9],
            [9,1,9,9,9],
            [9,0,9,9,9]
        ],
        point: 80,
        getPatterns: function() {
            return mixupPatterns({
                template1: [
                    [0,1,1,1,0]
                ],
                yrange: [1,3],
                template2: [
                    [0],
                    [1],
                    [1],
                    [1],
                    [0]
                ],
                xrange: [1, 3],
                matParam: {
                    width: 5,
                    height: 5,
                    val:9
                }
            });
        }
    },
    // loop
    {
        pattern: [
            [0,9,9,9,9],
            [0,1,1,1,0],
            [9,9,1,9,9],
            [9,9,9,1,9],
            [9,9,9,9,0]
        ],
        point: 90,
        getPatterns: function() {
            return mixupPatterns({
                template1: [
                    [0,1,1,1,0]
                ],
                yrange: [1,3],
                template2: [
                    [0,9,9,9,9],
                    [9,1,9,9,9],
                    [9,9,1,9,9],
                    [9,9,9,1,9],
                    [9,9,9,9,0]
                ],
                xrange: (yval) => [0, 3-yval],
                matParam: {
                    width: 7,
                    height: 5,
                    val:9
                }
            });
        }
    },
    /**
     * live 3 and dead 3
     */
    // loop
    {
        pattern: [
            [0,9,9,9],
            [1,1,1,0],
            [1,9,9,9],
            [1,9,9,9],
            [0,9,9,9]
        ],
        point: 70,
        getPatterns: function() {
            return mixupPatterns({
                template1: [
                    [1,1,1,0]
                ],
                yrange: [1,3],
                template2: [
                    [0],
                    [1],
                    [1],
                    [1],
                    [0]
                ],
                xrange: [0, 2],
                matParam: {
                    width: 4,
                    height: 5,
                    val:9
                }
            });
        }
    },
    // loop
    {
        pattern: [
            [0,9,9,9,9],
            [9,1,1,1,0],
            [9,9,1,9,9],
            [9,9,9,1,9],
            [9,9,9,9,0]
        ],
        point: 70,
        getPatterns: function() {
            return mixupPatterns({
                template1: [
                    [9,1,1,1,0]
                ],
                yrange: [1,3],
                template2: [
                    [0,9,9,9,9],
                    [9,1,9,9,9],
                    [9,9,1,9,9],
                    [9,9,9,1,9],
                    [9,9,9,9,0]
                ],
                xrange: (yval) => [0, 3-yval],
                matParam: {
                    width: 7,
                    height: 5,
                    val:9
                }
            });
        }
    },{
        pattern: [
            [0,9,9,9,9],
            [0,1,1,1,9],
            [9,9,1,9,9],
            [9,9,9,1,9],
            [9,9,9,9,0]
        ],
        point: 70,
        getPatterns: function() {
            return mixupPatterns({
                template1: [
                    [0,1,1,1,9]
                ],
                yrange: [1,3],
                template2: [
                    [0,9,9,9,9],
                    [9,1,9,9,9],
                    [9,9,1,9,9],
                    [9,9,9,1,9],
                    [9,9,9,9,0]
                ],
                xrange: (yval) => [0, 3-yval],
                matParam: {
                    width: 7,
                    height: 5,
                    val:9
                }
            });
        }
    },
    /**
     * live 3
     */
    {
        pattern: [[0,1,1,1,0]],
        point: 60
    },
    {
        pattern: [
            [0,9,9,9,9],
            [9,1,9,9,9],
            [9,9,1,9,9],
            [9,9,9,1,9],
            [9,9,9,9,0]
        ],
        point: 60
    },
    /**
     * dead 4
     */
    {
        pattern: [[1,1,1,1,0]],
        point: 50
    },
    {
        pattern: [
            [1,9,9,9,9],
            [9,1,9,9,9],
            [9,9,1,9,9],
            [9,9,9,1,9],
            [9,9,9,9,0]
        ],
        point: 50
    },
    /**
     * double live 2
     */
    {
        pattern: [
            [9,0,9,9],
            [0,1,1,0],
            [9,1,9,9],
            [9,0,9,9],
        ],
        point: 40
    },{
        pattern: [
            [0,9,9,9],
            [0,1,1,0],
            [9,9,1,9],
            [9,9,9,0],
        ],
        point: 40
    },
    /**
     * dead 3
     */
    {
        pattern: [
            [0,1,1,1]
        ],
        point: 30
    },{
        pattern: [
            [1,9,9,9],
            [9,1,9,9],
            [9,9,1,9],
            [9,9,9,0],
        ],
        point: 30
    },
    /**
     * live 2
     */
    {
        pattern: [
            [0,1,1,0]
        ],
        point: 20
    },{
        pattern: [
            [0,9,9,9],
            [9,1,9,9],
            [9,9,1,9],
            [9,9,9,0]
        ],
        point: 20
    },
    /**
     * dead 2
     */
    {
        pattern: [
            [0,1,1]
        ],
        point: 10
    },{
        pattern: [
            [0,9,9],
            [9,1,9],
            [9,9,1]
        ],
        point: 10
    },
    /**
     * single
     */
    {
        pattern: [
            [1,1]
        ],
        point: 5
    },
    {
        pattern: [
            [1,9],
            [9,1],
        ],
        point: 5
    }
];

// expand all patterns including generated ones
let patterns = flatten(dictionary.map((item) => {
    if(!item.getPatterns) return item;
    return item.getPatterns().map((e) => {
        return {
            pattern: e,
            point: item.point
        }
    });
}));

export default patterns;