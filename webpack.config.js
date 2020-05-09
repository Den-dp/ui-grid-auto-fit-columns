const { CleanWebpackPlugin } = require('clean-webpack-plugin');

module.exports = {
  output: {
    filename: 'ui-grid.auto-fit-columns.umd.js',
    libraryTarget: 'umd'
  },
  externals: {
    angular: 'angular'
  },
  resolve: {
    extensions: ['.ts', '.js']
  },
  module: {
    rules: [
      {
        test: /\.ts$/,
        loader: 'ts-loader',
        options: {
          configFile: 'tsconfig.app.json'
        }
      }
    ]
  },
  devtool: 'source-map',
  plugins: [
    new CleanWebpackPlugin(),
  ]
};
