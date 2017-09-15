var path = require('path');
var extend = require('webpack-merge');
var webpack = require('webpack');
var DashboardPlugin = require('webpack-dashboard/plugin');
var HtmlWebpackPlugin = require('html-webpack-plugin');
var ExtractTextPlugin = require('extract-text-webpack-plugin');
// `CheckerPlugin` is optional. Use it if you want async error reporting.
// We need this plugin to detect a `--watch` mode. It may be removed later
// after https://github.com/webpack/webpack/issues/3460 will be resolved.
var CheckerPlugin = require('awesome-typescript-loader').CheckerPlugin;

module.exports = {
  context: path.resolve(process.cwd(), 'src'),

  entry: {
    'polyfill': './polyfill.ts',
    'vendor': './vendor.ts',
    'main': './main.ts',
  },

  output: {
    filename: '[name].js?[hash]',
  },

  resolve: {
    modules: [
      path.resolve(process.cwd(), 'src'),
      'node_modules'
    ],
    extensions: ['.js', '.ts'],
  },

  module: {
    rules: [
      {
        test: /\.pug$/,
        loader: 'pug-loader',
      },
      {
        test: /\.ts$/,
        loader: 'awesome-typescript-loader',
      },
      {
        test: /\.(png|jpe?g|svg|fx|woff2?)$/,
        loader: 'file-loader',
        options: {
          name: 'assets/[name].[ext]?[hash]',
        },
      },
      {
        test: /\.babylon$/,
        loader: 'babylon-file-loader',
        options: {
          name: 'assets/[name].[ext]?[hash]',
        },
      },
      {
        test: /\.css$/,
        use: ExtractTextPlugin.extract({
          use: [
            {
              loader: 'css-loader',
            },
          ],
        })
      },
    ],
  },

  plugins: [
    new DashboardPlugin(),
    new ExtractTextPlugin('index.css?[hash]'),
    new webpack.ProvidePlugin({
      BABYLON: 'babylonjs',
      Earcut: path.resolve(process.cwd(), 'lib/earcut'),
    }),
    new webpack.optimize.CommonsChunkPlugin({
      names: ['main', 'vendor', 'polyfill'],
    }),
    new HtmlWebpackPlugin({
      inject: false,
      template: './index.pug',
    }),
    new CheckerPlugin(),
  ],
};
