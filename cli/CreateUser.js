const { parseArgs } = require('util')

const createUser = require('../clogs/usecase/users/create')

function main() {
	const options = {
		screenname: {
			type: 'string',
			short: 'n',
			default: 'dev',
		},
	}
	const args = process.argv.slice(2)
	const { values: props, positionals } = parseArgs({ args, options, allowPositionals: true })

	const screenname = positionals[0] || props.screenname
	return createUser(screenname)
}

if (require.main === module) {
	main().then(user => console.log(user))
} else {
	module.exports = main
}
