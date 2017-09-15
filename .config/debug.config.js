var path = require('path');
var merge = require('webpack-merge');
var webpack = require('webpack');

/* Import common configuration for debug and dist */
var commonConfig = require('./common.config.js');

module.exports = merge.smart(commonConfig, {

  output: {
    path: path.join(process.cwd(), 'debug'),
  },

  plugins: [
    new webpack.NamedModulesPlugin(),
    new webpack.LoaderOptionsPlugin({
      debug: true,
      options: {
        styleLoader: {
          sourceMap: true,
        },
        cssLoader: {
          sourceMap: true,
        },
      },
    }),
    new webpack.DefinePlugin({
      'process.env': {
        'ENV': '"development"',
      },
    }),
  ],

  devServer: {
    contentBase: path.join(process.cwd(), 'debug'),
    host: '0.0.0.0',
    port: 8080,
  },

  devtool: 'cheap-module-eval-source-map',
});
