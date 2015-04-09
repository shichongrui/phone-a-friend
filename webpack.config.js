var webpack = require('webpack');

module.exports = {
  entry: {
    "service-client": [
//      'babel/polyfill',
      './src/app.js'
    ],
    "service-cdn": [
      './service-worker/service-cdn.js'
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
