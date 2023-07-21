import { createBullBoard } from '@bull-board/api'
import { BullMQAdapter } from '@bull-board/api/bullMQAdapter.js'
import { FastifyAdapter } from '@bull-board/fastify'
import { NestFastifyApplication } from '@nestjs/platform-fastify'
import { Queue } from 'bullmq'

import env from '../../constants/env.js'
import { RedisService } from '../usecase/utils/redis.service.mjs'

export function setupBullMQ(app: NestFastifyApplication) {
	const redis = app.get(RedisService)
	const serverAdapter = new FastifyAdapter().setBasePath('/bull')
	createBullBoard({
		// eslint-disable-next-line @typescript-eslint/no-unsafe-return
		queues: Object.keys(env.hawksQueues).map(queue => new BullMQAdapter(new Queue(queue, { connection: redis }))),
		serverAdapter,
	})

	// @ts-expect-error Fix ts error
	app.register(serverAdapter.registerPlugin(), { prefix: '/bull' })
}
