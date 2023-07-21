
const { Queue } = require('bullmq')
const IORedis = require('ioredis')

const connection = new IORedis(6379, 'redis')
const queue = new Queue('main', { connection })

module.exports = queue
