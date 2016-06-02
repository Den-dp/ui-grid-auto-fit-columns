var webpack = require('webpack');
var NgAnnotatePlugin = require('ng-annotate-webpack-plugin');

module.exports = {
    entry: './src/index.ts',

    output: {
        path: './dist',
        filename: 'bundle.js',
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
