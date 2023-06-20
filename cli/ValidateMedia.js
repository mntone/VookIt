const { parseArgs } = require('util')

const mediaValidator = require('../hawks/usecases/validators/media')

async function main() {
	const options = {
		input: {
			type: 'string',
			short: 'i',
		},
	}
	const args = process.argv.slice(2)
	const { values: props, positionals } = parseArgs({ args, options, allowPositionals: true })

	const input = positionals[0] || props.input
	try {
		await mediaValidator(input)
	} catch (err) {
		console.log(err)
	}
}

if (require.main === module) {
	main()
} else {
	module.exports = main
}
