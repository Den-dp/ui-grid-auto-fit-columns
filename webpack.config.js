var webpack = require('webpack');
var NgAnnotatePlugin = require('ng-annotate-webpack-plugin');

var NODE_ENV = process.env.NODE_ENV || 'development';

function isProduction() {
    return NODE_ENV === 'production';
}

module.exports = {
    entry: './src/index.ts',

    output: {
        path: './dist',
        filename: isProduction() ? 'autoFitColumns.min.js' : 'autoFitColumns.js',
        libraryTarget: 'umd'
    },

    externals: {
        angular: 'angular'
    },

    resolve: {
        extensions: ['', '.ts', '.webpack.js', '.web.js', '.js']
    },

    devtool: 'source-map',

    module: {
        loaders: [
            { test: /\.ts$/, loader: 'awesome-typescript', exclude: /(node_modules|bower_components)/ }
        ]
    },

    plugins: [
        new NgAnnotatePlugin({
            add: true
        })
    ]
};

if(isProduction()) {
    module.exports.plugins.push(
        new webpack.optimize.UglifyJsPlugin({compress: {
            warnings: false,
            drop_console: true
        }})
    );
}
