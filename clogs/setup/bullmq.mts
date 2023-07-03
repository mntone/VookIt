import { createBullBoard } from '@bull-board/api'
import { BullMQAdapter } from '@bull-board/api/bullMQAdapter.js'
import { FastifyAdapter } from '@bull-board/fastify'
import { NestFastifyApplication } from '@nestjs/platform-fastify'
import { Queue } from 'bullmq'
import IORedis from 'ioredis'

import env from '../../constants/env.js'

export function setupBullMQ(app: NestFastifyApplication) {
	// @ts-expect-error Fix types error
	const connection = new IORedis(env.redisPort, env.redisHost, env.redisOptions)
	const serverAdapter = new FastifyAdapter().setBasePath('/bull')
	createBullBoard({
		// eslint-disable-next-line @typescript-eslint/no-unsafe-return
		queues: Object.keys(env.hawksQueues).map(queue => new BullMQAdapter(new Queue(queue, { connection }))),
		serverAdapter,
	})

	// @ts-expect-error Fix ts error
	app.register(serverAdapter.registerPlugin(), { prefix: '/bull' })
}
