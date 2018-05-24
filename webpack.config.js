const webpack = require('webpack');
const path = require('path');

// Constant with our paths
var SRC_DIR = path.join(__dirname, '/public/src');
var DIST_DIR = path.join(__dirname, '/public/dist');

// Webpack configuration
module.exports = {
  entry: `${SRC_DIR}/index.jsx`,
  output: {
  	path: DIST_DIR,
    filename: 'bundle.js',
  },
  // Tell webpack to use html plugin
  // plugins: [
  //   new HtmlWebpackPlugin({
  //     template: path.join(__dirname, 'index.html'),
  //   }),
  // ],
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: [
          'babel-loader',
        ],
      },
    ],
  },
  resolve: {
    extensions: ['.js', '.jsx'],
  },
   externals: {
    'react/addons': true, // important!!
    'react/lib/ReactContext': true,
    'react/lib/ExecutionEnvironment': true
  }
};