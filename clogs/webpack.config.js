const path = require('path')
const zlib = require('zlib')

const zopfli = require('@gfx/zopfli')
const CompressionPlugin = require('compression-webpack-plugin')
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const ReactLoadableSSRAddon = require('react-loadable-ssr-addon')
const TerserPlugin = require('terser-webpack-plugin')

const environment = process.env.NODE_ENV || 'development'
const isDev = environment === 'development'

const plugins = [
	new MiniCssExtractPlugin({
		filename: isDev ? '[name].css' : '[name]-[contenthash:3].css',
	}),
]
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
	name: 'client-assets',
	entry: {
		// JavaScript
		main: './clogs/scripts/app.js',
		validation: {
			dependOn: 'main',
			import: './clogs/scripts/validation.js',
		},
		upload: './clogs/scripts/upload.js',

		// SASS
		base: './clogs/styles/base.sass',
		bulma: './clogs/styles/bulma.sass',
	},
	devtool: isDev
		? 'eval-cheap-module-source-map' // build: slow, rebuild: fast
		: 'hidden-source-map',
	module: {
		rules: [
			{
				test: /\.js$/i,
				exclude: /node_modules/,
				use: [],
			},
			{
				test: /\.sass$/i,
				exclude: /node_modules/,
				use: [
					{
						loader: MiniCssExtractPlugin.loader,
						options: {
							publicPath: (resourcePath, context) => {
								return path.relative(path.dirname(resourcePath), context) + '/'
							},
						},
					},
					{
						loader: 'css-loader',
						options: {
							sourceMap: true,
						},
					},
					{
						loader: 'sass-loader',
						options: {
							implementation: require('sass'),
							sourceMap: true,
						},
					},
				],
			},
		],
	},
	optimization: {
		minimize: !isDev,
		minimizer: [
			new TerserPlugin({
				terserOptions: {
				/* eslint-disable camelcase */
					ecma: 2022,
					parse: {
						shebang: false,
					},
					compress: {
						keep_fargs: false,
						passes: 2,
						unsafe_arrows: true,
						unsafe_comps: true,
						unsafe_methods: true,
					},
					format: {
						shebang: false,
					},
					toplevel: true,
				/* eslint-enable camelcase */
				},
				extractComments: false,
			}),
			new CssMinimizerPlugin({
				exclude: /node_modules/,
				minify: CssMinimizerPlugin.lightningCssMinify,
			}),
		],
	},
	output: {
		filename: '[name].js',
		path: path.resolve(process.cwd(), '.assets'),
	},
	plugins,
}
