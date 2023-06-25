import { Processor, Worker, WorkerOptions } from 'bullmq'
import IORedis from 'ioredis'

// @ts-ignore
import env from '../constants/env.js'
// @ts-ignore
import initConstants from '../constants/init.js'

import { CodecConfigLoader } from './usecases/workers/CodecConfigLoader.mjs'
import { encodeHandler } from './usecases/workers/encodeHandler.mjs'
import { mainHandler } from './usecases/workers/mainHandler.mjs'

export async function main() {
	// Init constants.
	initConstants()

	// Load configs.
	await CodecConfigLoader.instance.load()

	// Init workers.
	const connection = new IORedis(env.redisPort, env.redisHost, env.redisOptions)
	const baseOptions: WorkerOptions = {
		autorun: false,
		concurrency: env.hawksDefaultConcurrency,
		connection,
		removeOnComplete: { count: env.hawksKeepJobCountOnComplete },
		removeOnFail: { count: env.hawksKeepJobCountOnFailure },
		lockDuration: env.hawksDefaultStalledDuration,
	}
	const workers = CodecConfigLoader.instance.queues.map(name => {
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		const handler: Processor<any, void, string> = name === 'main' ? mainHandler : encodeHandler
		const options = Object.assign({}, baseOptions)
		const queueConfig = env.hawksQueues[name]
		if (typeof queueConfig === 'object') {
			if (queueConfig.concurrency) {
				options.concurrency = queueConfig.concurrency
			}
			if (queueConfig.stalledDuration) {
				options.lockDuration = queueConfig.stalledDuration
			}
		}
		return new Worker(name, handler, options)
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

main()
