const path = require('path');
const webpack = require('webpack');

module.exports = {
  mode: "production",
  entry: path.resolve(__dirname, './index.txt'),
  output: {
	path: path.resolve(__dirname, "./dist"),
	filename: "app.js"
  },
  module: {
	rules: [
	  {
		test: /\.txt$/,
		use: [
		  {
			loader: path.resolve('./src/loader.js'),
			options: {
			  name: 'Alice'
			}
		  }
		]
	  }
	]
  }
};
