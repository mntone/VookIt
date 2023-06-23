const { createBullBoard } = require('@bull-board/api')
const { BullMQAdapter } = require('@bull-board/api/bullMQAdapter')
const { ExpressAdapter } = require('@bull-board/express')
const { Queue } = require('bullmq')
const express = require('express')
const IORedis = require('ioredis')

const env = require('../../constants/env')
const { loadYamlSync } = require('../../hawks/utils/yaml-loader')

const workersConfig = loadYamlSync(__dirname, '../../hawks/configs/workers')
const connection = new IORedis(env.redisPort, env.redisHost, env.redisOptions)
const serverAdapter = new ExpressAdapter().setBasePath('/bull')
createBullBoard({
	queues: Object.values(workersConfig.queues).map(queue => new BullMQAdapter(new Queue(queue.name, { connection }))),
	serverAdapter,
})

const router = express
	.Router({
		strict: true,
	})
	.use('/', serverAdapter.getRouter())

module.exports = router
