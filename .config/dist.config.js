var path = require('path');
var merge = require('webpack-merge');
var webpack = require('webpack');

/* Import common configuration for debug and dist */
var commonConfig = require('./common.config.js');

module.exports = merge.smart(commonConfig, {

  output: {
    path: path.join(process.cwd(), 'dist'),
  },

  plugins: [
    new webpack.optimize.ModuleConcatenationPlugin(),
    new webpack.NoEmitOnErrorsPlugin(),
    new webpack.LoaderOptionsPlugin({
      minimize: true,
      debug: false,
    }),
    new webpack.optimize.UglifyJsPlugin({
      parallel: {
        cache: true,
        workers: 4,
      },
      uglifyOptions: {
        ie8: false,
        warnings: false,
        output: {
          comments: false,
        },
        mangle: {
          keep_fnames: true, // https://github.com/angular/angular/issues/10618
        },
      }
    }),
    new webpack.DefinePlugin({
      'process.env': {
        'ENV': '"production"',
      }
    }),
  ],
});
