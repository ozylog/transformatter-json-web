'use strict';

const webpack = require('webpack');
const OfflinePlugin = require('offline-plugin');
const merge = require('webpack-merge');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const base = require('./webpack');
const envVars = [];

module.exports = merge(base, {
  mode: 'production',
  plugins: [
    new webpack.EnvironmentPlugin(envVars),
    new OfflinePlugin({
      publicPath: '/',
      caches: {
        main: [
          'vendors.*.js',
          'app.*.js',
        ],
        additional: [
          ':externals:'
        ],
        optional: [
          ':rest:'
        ]
      },
      safeToUseOptionalCaches: true,
      ServiceWorker: {
        navigateFallbackURL: '/'
      }
    }),
    new CopyWebpackPlugin([{
      from: 'assets', to: 'assets'
    }])
  ]
});
