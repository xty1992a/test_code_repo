process.env.NODE_ENV = 'development';

const base = require('./webpack.base');
const webpack = require('webpack');
const merge = require('webpack-merge');
const root = p => path.join(__dirname, '..', p);
const path = require('path');
// const portfinder = require('portfinder');
// const FriendlyErrorsPlugin = require('friendly-errors-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = (opt = {}) => new Promise((resolve, reject) => {
  const config = {
	mode: 'development',
	devServer: {
	  contentBase: path.resolve(__dirname, '..'),
	  compress: true,
	  quiet: true,
	  hot: true,
	  port: 8080,
	  host: 'localhost',
	  publicPath: '/',
	  disableHostCheck: true,
	},
	plugins: [
	  new webpack.HotModuleReplacementPlugin(),
	  new HtmlWebpackPlugin({
		filename: 'index.html',
		template: 'index.html',
		inject: true,
		hash: true,
	  }),
	],
  };
  /*
	portfinder.basePort = config.devServer.port;
	portfinder.getPort((err, port) => {
	  if (err) {
		return reject(err);
	  }
	  config.devServer.port = port;
	  config.plugins.push(new FriendlyErrorsPlugin({
		compilationSuccessInfo: {
		  messages: [`Your application is running here: http://${config.devServer.host}:${port}`],
		},
	  }));
	});*/

  resolve(merge(base, config));
});
