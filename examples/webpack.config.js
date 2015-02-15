var path    = require('path');
var webpack = require('webpack');

module.exports = {

  devtool: 'inline-source-map',

  entry: {
    example: path.join(__dirname, 'app.jsx')
  },

  output: {
    path          : 'examples/__build__',
    filename      : '[name].js',
    chunkFilename : '[id].chunk.js',
    publicPath    : '/__build__/'
  },

  module: {
    loaders: [
      { test: /\.jsx$/, loader: 'jsx-loader?harmony' }
    ]
  },

  resolve: {
    alias: {
      'hv-react-calendar': '../modules/HvReactCalendar.jsx'
    }
  },

  plugins: [
    new webpack.optimize.CommonsChunkPlugin('shared.js'),
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV || 'development')
    })
  ]

};
