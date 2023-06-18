const { parseArgs } = require('util')

const deleteUpload = require('../clogs/usecase/uploads/delete')

function main() {
	const options = {
		uuid: {
			type: 'string',
		},
	}
	const args = process.argv.slice(2)
	const { values: props, positionals } = parseArgs({ args, options, allowPositionals: true })

	const uuid = positionals[0] || props.uuid
	return deleteUpload(uuid)
}

if (require.main === module) {
	main()
} else {
	module.exports = main
}
