const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const HtmlWebpackPrefixPlugin = require('html-webpack-prefix-plugin');
const autoprefixer = require('autoprefixer');
const webpack = require('webpack');

const CSSLoader = {
  loader: 'css-loader',
  options: {
    modules: false,
    sourceMap: true,
  },
};

const postCSSLoader = {
  loader: 'postcss-loader',
  options: {
    ident: 'postcss',
    sourceMap: true,
    plugins: () => [
      autoprefixer({
        browsers: ['>1%', 'last 4 versions', 'Firefox ESR', 'not ie < 9'],
      }),
    ],
  },
};

module.exports = {
  entry: ['./webapp/src/index.js', 'react-dev-utils/webpackHotDevClient'],
  output: {
    path: path.join(__dirname, './public/locate'),
    filename: 'index-bundle.js',
  },
  devServer: {
    host: '0.0.0.0',
    hot: true,
    port: 8080,
    historyApiFallback: true,
    proxy: {
      '/api': 'http://localhost:3000',
    },
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: ['babel-loader'],
      },
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader'],
      },
      {
        test: /\.scss$/,
        use: [
          'style-loader', // creates style nodes from JS strings
          CSSLoader, // translates CSS into CommonJS
          postCSSLoader,
          'sass-loader', // compiles Sass to CSS, using Node Sass by default
        ],
      },
      {
        test: /\.(jpe?g|png|gif|svg)$/i,
        use: [
          {
            loader: 'file-loader',
            options: {
              hash: 'sha512',
              digest: 'hex',
              name: '[hash].[ext]',
              outputPath: 'img/',
            },
          },
        ],
      },
      {
        test: /\.(woff|woff2|ttf|eot)(\?v=\d+\.\d+\.\d+)?$/,
        use: [
          {
            loader: 'file-loader',
            options: {
              name: '[name].[ext]',
              outputPath: 'fonts/',
              publicPath: url => `../public/fonts/${url}`,
            },
          },
        ],
      },
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: path.join(__dirname, './webapp/public/index.html'),
      inject: true,
      filename: 'index.html',
    }),
    new HtmlWebpackPrefixPlugin(),
    new MiniCssExtractPlugin({
      filename: '[name].css',
      chunkFilename: '[id].css',
    }),
    new webpack.DefinePlugin({
        "process.env": {
          TRACK_APP_BASE_URL: process.env.TRACK_APP_BASE_URL,
        },
    }),
  ],
  resolve: {
    alias: {
      '@UI': path.resolve(__dirname, '../src/UI/'),
      '@fonts': path.resolve(__dirname, '../public/fonts/'),
      '@img': path.resolve(__dirname, '../public/img/'),
    },
  },
};
