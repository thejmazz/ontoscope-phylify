'use strict'
const HtmlWebpackPlugin = require('html-webpack-plugin')
const CopyWebpackPlugin = require('copy-webpack-plugin')

module.exports = {
  entry: ['./index.js'],
  output: {
    path: 'dist',
    filename: 'bundle.js'
  },
  devtool: 'sourcemap',
  module: {
    loaders: [{
      test: /\.js?$/,
      exclude: /(node_modules)/,
      loader: 'babel'                                              
    }]
  },
  plugins: [
    new HtmlWebpackPlugin(),
    new CopyWebpackPlugin([{from: 'public'}])
  ]
}