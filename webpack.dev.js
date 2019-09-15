'use strict';

const merge = require('webpack-merge');
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');
const Dotenv = require('dotenv-webpack');
const base = require('./webpack');

module.exports = merge(base, {
  mode: 'development',
  devtool: 'inline-source-map',
  devServer: {
    historyApiFallback: true
  },
  plugins: [
    new Dotenv(),
    new BundleAnalyzerPlugin({
      analyzerMode: 'server', // server, disabled
      openAnalyzer: false // http://127.0.0.1:8888
    })
  ]
});
