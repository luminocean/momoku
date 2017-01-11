export default {
    // standard gomoku chess board size
    shape: {
        width: 15,
        height: 15
    },
    rules: {
      limit: 5
    },
    movers: [
        {}, // placeholder to skip index 0
        {
            name: 'black',
            icon: '\u25CF'
        },{
            name: 'white',
            icon: '\u25CB'
        }
    ]
};
