/* eslint-disable @typescript-eslint/no-var-requires */
const { parseArgs } = require('util')

const { Queue } = require('bullmq')
const IORedis = require('ioredis')

const env = require('../constants/env')

async function main() {
	const options = {
		id: {
			type: 'string',
		},
		extension: {
			type: 'string',
			short: 'e',
			default: '.mp4',
		},
		queueName: {
			type: 'string',
			short: 'q',
			default: 'main',
		},
	}
	const args = process.argv.slice(2)
	const { values: props, positionals } = parseArgs({ args, options, allowPositionals: true })

	const id = positionals[0] || props.id
	const extension = props.extension
	const queueName = props.queueName

	let connection = null
	try {
		connection = new IORedis(env.redisPort, env.redisHost, env.redisOptions)
		const queue = new Queue(queueName, { connection })
		const job = await queue.add('encode:cli', {
			id,
			ext: extension,
			cursor: -1,
			phase: 'pending',
		})
		await job.waitUntilFinished(queue)
	} finally {
		connection?.disconnect()
		process.exit(0)
	}
}

if (require.main === module) {
	main()
} else {
	module.exports = main
}
