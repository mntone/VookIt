
const { Queue } = require('bullmq')
const IORedis = require('ioredis')

const env = require('../../../constants/env')

const connection = new IORedis(env.redisPort, env.redisHost, env.redisOptions)
const queue = new Queue('main', { connection })

module.exports = queue
