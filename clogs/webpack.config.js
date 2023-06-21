const path = require('path')

const TerserPlugin = require('terser-webpack-plugin')

const environment = process.env.NODE_ENV || 'development'

module.exports = {
	mode: environment,
	name: 'commonjs',
	entry: {
		main: './clogs/scripts/app.js',
		upload: './clogs/scripts/upload.js',
	},
	devtool: environment === 'development'
		? 'eval-cheap-module-source-map' // build: slow, rebuild: fast
		: false,
	optimization: {
		minimize: environment !== 'development',
		minimizer: [new TerserPlugin({
			terserOptions: {
				/* eslint-disable camelcase */
				ecma: 2015,
				parse: {
					shebang: false,
				},
				compress: {
					keep_fargs: false,
				},
				mangle: {
					reserved: ['AppearanceModal', 'installUpload'],
					properties: true,
				},
				format: {
					quote_style: 1,
					shebang: false,
				},
				toplevel: true,
				/* eslint-enable camelcase */
			},
		})],
	},
	output: {
		filename: '[name].js',
		path: path.resolve(process.cwd(), './.assets'),
	},
}
