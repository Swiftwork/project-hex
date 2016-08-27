var path = require('path');
var extend = require('webpack-merge');
var webpack = require('webpack');
var HtmlWebpackPlugin = require('html-webpack-plugin');
//var LiveReloadPlugin = require('webpack-livereload-plugin');

var PROD = process.argv.indexOf('--production') != -1 || process.env.NODE_ENV == 'production';

//------------------------------------------------------------------------------------
// COMMON CONFIG FOR DEV AND PROD
//------------------------------------------------------------------------------------

var config = {
  context: path.resolve(process.cwd(), 'src'),

  entry: {
    'polyfills': './polyfills',
    'vendor': './vendor',
    'index': './index',
  },

  output: {
    filename: '[name].js',
    path: path.join(process.cwd(), 'build'),
  },

  resolve: {
    root: path.resolve(process.cwd(), 'src'),
    modulesDirectories: ['node_modules'],
    extensions: ['', '.js', '.ts'],
  },

  module: {
    loaders: [
      {
        test: /\.ts$/,
        loaders: ['ts'],
      },
      {
        test: /\.pug$/,
        loader: 'pug',
      },
      {
        test: /\.(png|jpe?g|gif|svg|woff|woff2|ttf|eot|ico|mp4)$/,
        loader: 'file',
        query: {
          name: PROD ? 'assets/[hash].[ext]' : 'assets/[name].[ext]',
        },
      },
    ],
  },

  plugins: [
    new webpack.optimize.CommonsChunkPlugin({
      name: ['index', 'vendor', 'polyfills'],
    }),
    new HtmlWebpackPlugin({
      inject: false,
      template: './index.pug',
    }),
  ],
};

if (PROD) {

  //------------------------------------------------------------------------------------
  // PRODUCTION SPECIFIC CONFIG
  //------------------------------------------------------------------------------------

  config = extend(true, config, {

    output: {
      publicPath: '/assets/',
    },

    plugins: [
      new webpack.NoErrorsPlugin(),
      new webpack.optimize.DedupePlugin(),
      new webpack.optimize.UglifyJsPlugin({
        output: {
          comments: false,
        },
        compressor: {
          warnings: false,
        },
      }),
      new webpack.DefinePlugin({
        'process.env': {
          'ENV': '"production"',
        },
      }),
    ],

  });

} else {

  //------------------------------------------------------------------------------------
  // DEVELOPMENT SPECIFIC CONFIG
  //------------------------------------------------------------------------------------

  config = extend(true, config, {

    output: {
      publicPath: 'http://localhost:8080/',
    },

    plugins: [
      new webpack.DefinePlugin({
        'process.env': {
          'ENV': '"development"',
        },
      }),
      /*
      new LiveReloadPlugin({
        appendScriptTag: true,
      }),
      */
    ],

    devtool: 'source-map',
  });
}

//------------------------------------------------------------------------------------
// EXPORT
//------------------------------------------------------------------------------------

module.exports = config;