const { parseArgs } = require('util')

const { Queue } = require('bullmq')
const IORedis = require('ioredis')

const env = require('../constants/env')
const { numToUsid } = require('../utils/IdSupport')

function main() {
	const options = {
		id: {
			type: 'string',
		},
		queueName: {
			type: 'string',
			short: 'q',
			default: 'init',
		},
		workflow: {
			type: 'string',
			short: 'w',
			default: 'sdr_hd',
		},
	}
	const args = process.argv.slice(2)
	const { values: props, positionals } = parseArgs({ args, options, allowPositionals: true })

	const id = numToUsid(Number(positionals[0] || props.id))
	const queueName = props.queueName
	const workflow = props.workflow

	const connection = new IORedis(env.redisPort, env.redisHost, env.redisOptions)
	const queue = new Queue(queueName, { connection })
	queue.add('init', { id, step: 0, workflow })
}

if (require.main === module) {
	main()
} else {
	module.exports = main
}
