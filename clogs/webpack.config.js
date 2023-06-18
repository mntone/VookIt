const path = require('path')

const TerserPlugin = require('terser-webpack-plugin')

const environment = process.env.NODE_ENV || 'development'

module.exports = {
	mode: environment,
	name: 'commonjs',
	entry: './clogs/scripts/app.js',
	devtool: environment === 'development'
		? 'eval-cheap-module-source-map' // build: slow, rebuild: fast
		: false,
	optimization: {
		minimize: environment === 'production',
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
					reserved: ['AppearanceModal'],
					properties: true,
				},
				format: {
					quote_style: 1,
					shebang: false,
				},
				toplevel: true,
				safari10: true,
				/* eslint-enable camelcase */
			},
		})],
	},
	output: {
		filename: 'bundle.js',
		path: path.resolve(process.cwd(), './.assets'),
	},
}
