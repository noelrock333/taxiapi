const path = require('path');
const merge = require('webpack-merge');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const HtmlWebpackPrefixPlugin = require('html-webpack-prefix-plugin');

const commonConfig = require('./common.config.js');

module.exports = merge(commonConfig, {
  plugins: [
    new HtmlWebpackPlugin({
      template: path.join(__dirname, '../webapp/public/index.html'),
      inject: true,
      filename: 'index.html',
      prefix: '/public/locate',
    }),
    new HtmlWebpackPrefixPlugin(),
  ],
});
