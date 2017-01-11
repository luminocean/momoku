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
    // loops
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
            let dimensions = [
                {
                    template: [
                        [1,1,1,1,0]
                    ],
                    yrange: [0,3]
                },
                {
                    template: [
                        [1],
                        [1],
                        [1],
                        [1],
                        [0]
                    ],
                    xrange: [0,3]
                }
            ];

            let patterns = [];

            let d1 = dimensions[0];
            for(let y=d1.yrange[0]; y<=d1.yrange[1]; y++){
                let d2 = dimensions[1];
                for(let x=d2.xrange[0]; x<=d2.xrange[1]; x++){
                    let matrix = mat(5, 5, 9);
                    coverOnMat(matrix, d1.template, 0, y);
                    coverOnMat(matrix, d2.template, x, 0);
                    patterns.push(matrix);
                }
            }

            return patterns;
        }
    },
    // loops
    {
        pattern: [
            [1,1,1,1,0],
            [9,1,9,9,9],
            [9,9,1,9,9],
            [9,9,9,1,9],
            [9,9,9,9,0]
        ],
        point: 90,
        variants: function(){
            // need variants here
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
        point: 90
    },
    {
        pattern: [
            [9,0,9,9,9],
            [1,1,1,1,0],
            [9,1,9,9,9],
            [9,1,9,9,9],
            [9,0,9,9,9]
        ],
        point: 90
    },
    {
        pattern: [
            [9,9,0,9,9],
            [1,1,1,1,0],
            [9,9,1,9,9],
            [9,9,1,9,9],
            [9,9,0,9,9]
        ],
        point: 90
    },
    {
        pattern: [
            [9,9,9,0,9],
            [1,1,1,1,0],
            [9,9,9,1,9],
            [9,9,9,1,9],
            [9,9,9,0,9]
        ],
        point: 90
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
        variants: function(){
            // swap horizontally
        }
    },
    // double live 3
    {
        pattern: [
            [9,0,9,9,9],
            [0,1,1,1,0],
            [9,1,9,9,9],
            [9,1,9,9,9],
            [9,0,9,9,9]
        ],
        point: 80,
        variants: function(){
            // swap horizontally
        }
    },
    // live 3 and dead 3
    {
        pattern: [
            [0,9,9,9],
            [1,1,1,0],
            [1,9,9,9],
            [1,9,9,9],
            [0,9,9,9]
        ],
        point: 70,
        variants: function(){
            // swap horizontally
        }
    },
    // live 3
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

console.log(patterns.length);

export default patterns;