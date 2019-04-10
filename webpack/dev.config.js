const merge = require('webpack-merge');
const commonConfig = require('./common.config.js');

module.exports = merge(commonConfig, {
  devServer: {
    host: '0.0.0.0',
    hot: true,
    port: 8080,
    historyApiFallback: true,
    proxy: {
      '/api': 'http://localhost:3000',
    },
  },
});
