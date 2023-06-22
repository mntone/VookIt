const { Job, Queue, QueueEvents } = require('bullmq')
const IORedis = require('ioredis')

// Load environment constants.
const env = require('../../constants/env')

const connection = new IORedis(env.redisPort, env.redisHost, env.redisOptions)

const encodingId = 3n
const queueName = 'init'

let count = 0
const queueEvents = new QueueEvents(queueName, { connection })
queueEvents.on('completed', async ({ jobId }) => {
	console.log(jobId)
	const job = await Job.fromId(queue, jobId)
	console.log(`${job.name} (${job.id}): completed`)
	await job.remove()

	count++
	if (count === 1) {
		process.exit(0)
	}
})

// id, input file, entry
const queue = new Queue(queueName, { connection })
queue.add('write', { id: encodingId.toString(), step: 0, text: 'no options' }/* , { removeOnComplete: true }*/)
// queue.add('write', { step: 0, text: 'with 1000ms delay' }, { delay: 1000/* , removeOnComplete: true*/ })
// queue.add('write', { step: 0, text: 'with 10 priority' }, { priority: 10/* , removeOnComplete: true*/ })
