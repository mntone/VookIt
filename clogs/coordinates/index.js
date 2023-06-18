const path = require('path')

const glob = require('glob')

module.exports = Object.fromEntries(glob
	.sync('*.js', {
		cwd: __dirname,
		ignore: ['index.js'],
	})
	.map(filepath => {
		const filename = path.basename(filepath, '.js')
		// eslint-disable-next-line import/no-dynamic-require
		return [filename, require('./' + filename)]
	}))
