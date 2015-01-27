var fs      = require('fs');
var path    = require('path');
var webpack = require('webpack');

function isDirectory(dir) {
  return fs.lstatSync(dir).isDirectory();
}

module.exports = {

  devtool: 'inline-source-map',

  entry: {
    example: path.join(__dirname, 'app.js')
  },

  output: {
    path          : 'examples/__build__',
    filename      : '[name].js',
    chunkFilename : '[id].chunk.js',
    publicPath    : '/__build__/'
  },

  module: {
    loaders: [
      { test: /\.js$/, loader: 'jsx-loader?harmony' }
    ]
  },

  resolve: {
    alias: {
      'hv-react-calendar': '../modules/index'
    }
  },

  plugins: [
    new webpack.optimize.CommonsChunkPlugin('shared.js'),
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV || 'development')
    })
  ]

};
