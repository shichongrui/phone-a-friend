var webpack = require('webpack');

module.exports = {
  entry: {
    main: [
//      'babel/polyfill',
      './src/app.js'
    ]
  },
  output: {
    path: __dirname,
    filename: 'bundle.js'
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
