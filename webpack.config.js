var webpack = require('webpack');

var plugins = [
  new webpack.DefinePlugin({
    'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV)
  })
];

if (process.env.COMPRESS) {
  plugins.push(
    new webpack.optimize.UglifyJsPlugin({
      compressor: {
        warnings: false
      }
    })
  );
}

module.exports = {

  output: {
    library: 'HvReactCalendar',
    libraryTarget: 'var'
  },

  module: {
    loaders: [
      { test: /\.jsx$/, loader: 'jsx-loader?harmony' }
    ]
  },

  externals: {
    react : 'React',
    'react/addons': 'React',
    moment: 'moment'
  },

  node: {
    Buffer: false
  },

  plugins: plugins

};
