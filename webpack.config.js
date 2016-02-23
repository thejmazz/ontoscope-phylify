'use strict'

const webpack = require('webpack')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const definePlugin = new webpack.DefinePlugin({
  __DEV__: JSON.stringify(process.env.NODE_ENV === 'dev' ? true : false)
})

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
    definePlugin,
    new HtmlWebpackPlugin(),
    new CopyWebpackPlugin([{from: 'public'}])
  ]
}
