'use strict';

const webpack = require('webpack');
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const htmlWebpackTemplate = require('html-webpack-template');
const packageJson = require('./package.json');
const env = process.env.NODE_ENV || 'local';

let htmlTemplate = {
  inject: false,
  template: htmlWebpackTemplate,
  title:  "JSON | Transformatter",
  meta: [
    {
      name: 'description',
      content: 'JSON Transformatter helps to validate and convert JSON',
      keywords: 'JSON Formatter, JSON Converter, JSON Validator, Validate JSON, Format JSON, Convert JSON to XML, JSON Beautify, JSON Pretty'
    },
    {
      name: 'keywords',
      content: 'JSON Formatter, JSON Converter, JSON Validator, Validate JSON, Format JSON, Convert JSON to XML, JSON Beautify, JSON Pretty'
    }
  ],
  lang: 'en-US',
  links: [
    'https://fonts.googleapis.com/css?family=Passion+One|Roboto+Mono&display=swap',
    {
      href: '/assets/icons/apple-touch-icon.png',
      rel: 'apple-touch-icon',
      sizes: '180x180'
    },
    {
      href: '/assets/icons/favicon-32x32.png',
      rel: 'icon',
      sizes: '32x32'
    },
    {
      href: '/assets/icons/favicon-16x16.png',
      rel: 'icon',
      sizes: '16x16'
    }
  ],
  appMountId: 'app'
};

if (env === 'production') {
  htmlTemplate = {
    ...htmlTemplate,
    googleAnalytics: {
      trackingId: 'UA-144281940-1',
      pageViewOnLoad: true
    }
  };
}


module.exports = {
  entry: {
    app: ['./src/index.tsx']
  },
  output: {
    path: path.resolve(__dirname, 'dist'),
    publicPath: '/',
    filename: '[name].[chunkhash].js'
  },
  module: {
    rules: [
      {
        enforce: "pre",
        test: /\.(js|jsx|ts|tsx)$/,
        exclude: /node_modules/,
        loader: "eslint-loader"
      },
      {
        test: /\.tsx?$/,
        loader: 'ts-loader',
        exclude: /node_modules/
      },
      {
        test: /\.(png|jpg|gif)$/i,
        use: [
          {
            loader: 'url-loader',
            options: {
              limit: 16000
            }
          }
        ]
      }
    ]
  },
  resolve: {
    alias: {
      '@src': path.resolve('./src')
    },
    modules: [
      path.resolve('./node_modules')
    ],
    extensions: [ '.tsx', '.ts', '.mjs', '.js' ]
  },
  plugins: [
    new HtmlWebpackPlugin(htmlTemplate),
    new webpack.EnvironmentPlugin({
      NAME: packageJson.name,
      VERSION: packageJson.version,
    })
  ],
  optimization: {
    splitChunks: {
      cacheGroups: {
        commons: {
          test: /[\\/]node_modules[\\/]/,
          name: 'vendors',
          chunks: 'all'
        }
      }
    }
  }
};
