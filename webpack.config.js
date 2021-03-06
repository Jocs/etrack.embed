const webpack = require('webpack')

module.exports = {
	devtool: 'source-map',
	entry: './src/index.js',
	output: {
		path: './dist',
		filename: 'etrack.min.js'
	},
	module: {
		loaders: [{
			test: /\.js$/,
			loader: 'babel'
		}]
	},
	plugins: [
		new webpack.DefinePlugin({
			'precess.env': {
				NODE_ENV: '"production"'
			},
			__DEVELOPMENT__: false
		}),
		new webpack.optimize.DedupePlugin(),
		new webpack.optimize.OccurenceOrderPlugin(),
		new webpack.optimize.UglifyJsPlugin({
			compress: {
				warnings: false
			}
		})
	]
}
