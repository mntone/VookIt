const { Worker } = require('bullmq')
const IORedis = require('ioredis')

const env = require('../../constants/env')
const initConstants = require('../../constants/init')
const { loadYaml } = require('../utils/yaml-loader')

/**
 * @returns {Promise<import('bullmq').Worker[]>}
 */
async function main() {
	// Init constants.
	initConstants()

	// Load worker handlers.
	const workersConfig = await loadYaml(__dirname, '../configs/workers')
	const workerHandlers = Object.keys(workersConfig.queues).reduce((handlers, key) => {
		// eslint-disable-next-line import/no-dynamic-require
		handlers[key] = require('./handlers/' + key)
		return handlers
	}, {})

	const connection = new IORedis(env.redisPort, env.redisHost, env.redisOptions)

	/**
	 * @type {import('bullmq').WorkerOptions}
	 */
	const baseOptions = {
		autorun: false,
		connection,
		lockDuration: env.hawksJobStalledDuration,
	}
	/**
	 * @type {import('bullmq').Worker[]}
	 */
	const workers = Object.entries(workersConfig.queues).map(([key, queue]) => {
		/**
		 * @type {import('bullmq').WorkerOptions}
		 */
		const options = {
			concurrency: queue.maxCount,
			...baseOptions,
		}
		return new Worker(queue.name, workerHandlers[key], options)
	})

	// Handle each signal
	const suspend = async () => {
		console.log('Suspend hawks (backend).\n')
		for (const worker of workers) {
			await worker.pause()
		}
	}
	const resume = () => {
		console.log('Resume hawks (backend).\n')
		for (const worker of workers) {
			worker.resume()
		}
	}
	const cleanup = async () => {
		console.log('Clean up hawks (backend).\n')
		for (const worker of workers) {
			await worker.close()
		}
	}
	const exit = process.exit.bind(null, 0)

	process
		.on('SIGTSTP', suspend)	// Catch "Ctrl+Z"
		.on('SIGCONT', resume)	// Catch "fg %[num]"
		.on('SIGINT', exit)		// Catch "Ctrl+C" (Forced exiting to press Ctrl+\)
		.on('SIGTERM', exit)	// Catch "kill [pid]"
		.on('exit', cleanup)	// Catch exit

	// Catch exception
	if (process.env.NODE_ENV === 'development') {
		process.on('uncaughtException', err => {
			console.log(err.stack)
			process.exit(-1)
		})
	} else {
		process.on('uncaughtException', process.exit.bind(null, -1))
	}

	for (const worker of workers) {
		worker.run()
	}
	return workers
}

if (require.main === module) {
	main()
} else {
	module.exports = main
}
