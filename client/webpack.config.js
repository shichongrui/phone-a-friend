var webpack = require('webpack');

module.exports = {
  entry: {
    "client": [
//      'babel/polyfill',
      './client/app.js'
    ],
    "worker": [
      './worker/worker.js'
    ]
  },
  output: {
    path: __dirname,
    filename: '[name].js'
  },
  devtool: "#source-map",
  cache: false,

  plugins: [
//    new webpack.optimize.UglifyJsPlugin(),
    new webpack.optimize.OccurenceOrderPlugin(),
  ],

  module: {
    loaders: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: 'babel-loader'
      }
    ]
  }
};
