const path = require('path')
const zlib = require('zlib')

const zopfli = require('@gfx/zopfli')
const CompressionPlugin = require('compression-webpack-plugin')
const ReactLoadableSSRAddon = require('react-loadable-ssr-addon')
const TerserPlugin = require('terser-webpack-plugin')

const environment = process.env.NODE_ENV || 'development'
const isDev = environment === 'development'

const plugins = []
if (!isDev) {
	plugins.push(
		new CompressionPlugin({
			compressionOptions: {
				numiterations: 10,
			},
			algorithm(input, compressionOptions, callback) {
				return zopfli.gzip(input, compressionOptions, callback)
			},
		}),
		new CompressionPlugin({
			filename: '[path][base].br',
			algorithm: 'brotliCompress',
			compressionOptions: {
				params: { [zlib.constants.BROTLI_PARAM_QUALITY]: 11 },
			},
		}),
	)
}
plugins.push(new ReactLoadableSSRAddon({
	filename: 'assets-manifest.json',
	integrity: true,
	integrityAlgorithms: ['sha256'],
}))

module.exports = {
	mode: environment,
	name: 'commonjs',
	entry: {
		main: './clogs/scripts/app.js',
		edit: {
			dependOn: 'main',
			import: './clogs/scripts/edit.js',
		},
		upload: './clogs/scripts/upload.js',
	},
	devtool: isDev
		? 'eval-cheap-module-source-map' // build: slow, rebuild: fast
		: false,
	optimization: {
		minimize: !isDev,
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
	plugins,
}
