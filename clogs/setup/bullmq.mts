import { createBullBoard } from '@bull-board/api'
import { BullMQAdapter } from '@bull-board/api/bullMQAdapter.js'
import { FastifyAdapter } from '@bull-board/fastify'
import { NestFastifyApplication } from '@nestjs/platform-fastify'
import { Queue } from 'bullmq'
import { Redis } from 'ioredis'

import { loadConfigurations } from '../../configurations/configurations.mjs'
import env from '../../constants/env.js'

export function setupBullMQ(app: NestFastifyApplication) {
	const conf = loadConfigurations().redis
	const connection = new Redis({
		...conf,
		maxRetriesPerRequest: 0,
	})
	const serverAdapter = new FastifyAdapter().setBasePath('/bull')
	createBullBoard({
		// eslint-disable-next-line @typescript-eslint/no-unsafe-return
		queues: Object.keys(env.hawksQueues).map(queue => new BullMQAdapter(new Queue(queue, { connection }))),
		serverAdapter,
	})

	// @ts-expect-error Fix ts error
	app.register(serverAdapter.registerPlugin(), { prefix: '/bull' })
}
