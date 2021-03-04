const path = require('path');
const VueLoaderPlugin = require('vue-loader/lib/plugin');
const PRODUCTION = process.env.NODE_ENV === 'production';

const baseConfig = {
  entry: root('src/index.js'),
  context: path.resolve(__dirname, '..'),
  output: {
	path: root('dist'),
	filename: PRODUCTION ? '[name]_[chunkhash:8].js' : '[name].js',
	chunkFilename: PRODUCTION ? '[name]_[chunkhash:8].js' : '[name].js'
  },
  module: {
	rules: [
	  {
		test: /\.js$/,
		loader: 'babel-loader',
		options: {
		  "presets": [
			[
			  "@babel/preset-env",
			  {
				"modules": false,
				"useBuiltIns": "usage",
				"corejs": "2"
			  }
			]
		  ],
		  "plugins": [
			"@babel/plugin-proposal-class-properties",
			"@babel/plugin-transform-runtime"
		  ]
		},
		exclude: /node_modules/
	  },
	  {
		test: /\.vue$/,
		loader: 'vue-loader'
	  },
	  {
		test: /\.css$/,
		use: [
		  'vue-style-loader',
		  'css-loader',
		  'postcss-loader',
		]
	  },
	  {
		test: /\.less$/,
		use: [
		  'vue-style-loader',
		  'css-loader',
		  'postcss-loader',
		  'less-loader'
		]
	  },
	]
  },
  plugins: [
	new VueLoaderPlugin()
  ]
};

module.exports = baseConfig;

// 将路径起点指向../src/pages
function root(p) {
  return path.join(__dirname, '..', p);
}
