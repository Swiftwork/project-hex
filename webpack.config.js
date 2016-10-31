var path = require('path');
var extend = require('webpack-merge');
var webpack = require('webpack');
var HtmlWebpackPlugin = require('html-webpack-plugin');
var ExtractTextPlugin = require('extract-text-webpack-plugin');

module.exports = function (env) {

  //var PROD = process.argv.indexOf('--production') != -1 || process.env.NODE_ENV == 'production';
  var PROD = env && env.production ? true : false;

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
      path: path.resolve(process.cwd(), 'build'),
    },

    resolve: {
      modules: [path.resolve(process.cwd(), 'src'), 'node_modules'],
      extensions: ['.js', '.ts'],
    },

    module: {
      rules: [
        {
          test: /\.ts$/,
          loader: 'awesome-typescript',
        },
        {
          test: /\.pug$/,
          loader: 'pug',
        },
        {
          test: /\.css$/,
          loader: ExtractTextPlugin.extract({ loader: 'css' }),
        },
        {
          test: /\.(png|jpe?g|svg|fx|woff2?)$/,
          loader: 'file',
          options: {
            name: PROD ? 'assets/[hash].[ext]' : 'assets/[name].[ext]',
          },
        },
        {
          test: /\.babylon$/,
          loader: 'babylon-file',
          options: {
            name: PROD ? 'assets/[hash].[ext]' : 'assets/[name].[ext]',
          },
        },
      ],
    },

    plugins: [
      new webpack.ProvidePlugin({
        BABYLON: 'babylonjs',
      }),
      new webpack.optimize.CommonsChunkPlugin({
        name: ['index', 'vendor', 'polyfills'],
      }),
      new HtmlWebpackPlugin({
        inject: false,
        template: './index.pug',
      }),
      new ExtractTextPlugin('./index.css'),
    ],
  };

  if (PROD) {

    //------------------------------------------------------------------------------------
    // PRODUCTION SPECIFIC CONFIG
    //------------------------------------------------------------------------------------

    config = extend(true, config, {

      plugins: [
        new webpack.NoErrorsPlugin(),
        new webpack.optimize.DedupePlugin(),
        new webpack.LoaderOptionsPlugin({
          minimize: true
        }),
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

      plugins: [
        new webpack.LoaderOptionsPlugin({
          debug: true
        }),
        new webpack.DefinePlugin({
          'process.env': {
            'ENV': '"development"',
          },
        }),
      ],

      devtool: 'source-map',
    });
  }

  return config;
};