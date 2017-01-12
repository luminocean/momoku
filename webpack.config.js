const path = require('path');
const webpack = require('webpack');
const merge = require('webpack-merge');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const TARGET = process.env.npm_lifecycle_event;

const PATHS = {
    app: path.join(__dirname, 'app'),
    build: path.join(__dirname, 'build'),
    public: path.join(__dirname, 'public')
};

// make node aware of scss file
require.extensions['.scss'] = () => {};

const HtmlWebpackMinifyOption = {
    removeComments: true,
    collapseWhitespace: true,
    removeRedundantAttributes: true,
    useShortDoctype: true,
    removeEmptyAttributes: true,
    removeStyleLinkTypeAttributes: true,
    keepClosingSlash: true,
    minifyJS: true,
    minifyCSS: true,
    minifyURLs: true
};

const common = {
    // supports multiple bundles
    entry: {
        index: PATHS.app + '/index.js'
    },
    output: {
        path: process.env['WEBPACK_OUTPUT_PATH'] || PATHS.build,
        // append hash only in production
        filename: `static/js/[name]${TARGET === 'build'?'.[hash:8]':''}.js`,
        chunkFilename: `static/js/[name]${TARGET === 'build'?'.[chunkhash:8]':''}.chunk.js`,
        // // this will be the prefix of the file name above whose default is ''
        // publicPath: '/',
    },
    // extension sequence used to resolve modules
    resolve: {
        extensions: ['', '.js', '.jsx']
    },
    module: {
        preLoaders: [
            {
                test: /\.(js|jsx)$/,
                loader: 'eslint',
                include: PATHS.app,
            }
        ],
        loaders: [
        // load other resources to output dir
        {
            exclude: [
                /\.html$/,
                /\.(js|jsx)$/,
                /\.s?css$/,
                /\.json$/,
                /\.svg$/
            ],
            loader: 'url',
            query: {
                limit: 10000,
                name: `static/media/[name]${TARGET === 'build'?'.[hash:8]':''}.[ext]`
            }
        },
        // handle import of css files and inject them into bundled js files
        {
            test: /\.s?css$/,
            include: PATHS.app,
            loaders: ['style', 'css', 'sass']
        },
        // handle js and jsx files by converting them into ES5 compatible js code
        {
            // supports both .js and .jsx files
            test: /\.jsx?$/,
            include: PATHS.app,
            loader: 'babel',
            query: {
                // need this two parameters for babel to handle es6 and react related features
                presets: ['es2015', 'react'],
                // enables cache for faster recompilation
                cacheDirectory: TARGET === 'start'
            }
        }]
    },
    plugins: [
        // // search entry points in the chunks options and extract their common modules into a single file
        // // if the chunks option is not specified, all entry points will be used
        // new webpack.optimize.CommonsChunkPlugin({
        //     chunks: ['index', 'random'],
        //     name: 'page-common',
        //     filename: `static/js/[name]${TARGET === 'start' ? '':'.[hash:8]'}.js`
        // }),
        new webpack.optimize.DedupePlugin(),
        // read the template html files, inject bundles from entries
        // and write the injected html files into output directory
        new HtmlWebpackPlugin({
            // index page
            filename: 'index.html',
            chunks: ['index'],
            template: PATHS.public + '/index.html',
            minify: TARGET === 'start' ? null : HtmlWebpackMinifyOption
        }),
        // new HtmlWebpackPlugin({
        //     // random page
        //     filename: 'random.html',
        //     chunks: ['page-common', 'random'],
        //     template: PATHS.public + '/random.html',
        //     favicon: PATHS.public + '/favicon.ico',
        //     minify: TARGET === 'start' ? null : HtmlWebpackMinifyOption
        // })
    ]
};

module.exports = common;

if (TARGET === 'start') {
    module.exports = merge(module.exports, {
        devtool: 'source-map',
        // config for webpack-dev-server
        devServer: {
            // Actually webpack-dev-server doesn't need a concrete path.
            // It will serve built assets from a 'virtual' build path.
            // Here we specify the public dir as the contentBase so that
            // files can be served by webpack-dev-server from this dir besides
            // the virtual build path
            contentBase: PATHS.public,
            hot: true,
            inline: true,
            // stats: 'errors-only'
            // progress: true,
            // historyApiFallback: true
        },
        plugins: [
            // support hot module replacement during development
            new webpack.HotModuleReplacementPlugin()
        ]
    });
}

if (TARGET === 'build') {
    module.exports = merge(module.exports, {
        plugins: [
            // used to produce production code for react,
            // instead of just minifing development code since some code used
            // in development only will be minified instead of completely removed
            new webpack.DefinePlugin({
                'process.env': {
                    NODE_ENV: JSON.stringify('production')
                }
            }),
            new webpack.optimize.UglifyJsPlugin({
                compress: {
                    warnings: false // disable annoying warnings
                }
            }),

        ]
    });
}
