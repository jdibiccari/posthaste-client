const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')

const HTMLWebpackPluginConfig = new HtmlWebpackPlugin({
  template: __dirname + '/app/index.html',
  filename: 'index.html',
  inject: 'body'
})

const PATHS = {
  app: path.join(__dirname, 'app'),
  build: path.join(__dirname, 'build')
}

module.exports = {
	entry: [
		PATHS.app
	],
	module: {
		loaders: [
			{
				test: /\.js$/,
				include: __dirname + '/app',
				loader: 'babel-loader'
			},
			{
				test: /\.scss$/,
				loader: "style-loader!css-loader!sass-loader"
			}
		]
	},
	output: {
	    filename: "index_bundle.js",
	    path: PATHS.build
	},
	plugins: [HTMLWebpackPluginConfig]
}