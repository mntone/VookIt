import { readFile } from 'fs/promises'

// @ts-expect-error Fix no types.
import babelRegister from '@babel/register'
import { NestFactory } from '@nestjs/core'
import { FastifyAdapter, NestFastifyApplication } from '@nestjs/platform-fastify'

import { loadConfigurations } from '../configurations/configurations.mjs'
import initConstants from '../constants/init.js'

import { AppModule } from './app.module.mjs'
import { setupBullMQ } from './setup/bullmq.mjs'
import { setupFastify } from './setup/fastify.mjs'
import { Prisma } from './usecase/utils/prisma.mjs'

async function bootstrap() {
	const isProd = process.env.NODE_ENV !== 'development'

	// Init shared variables.
	initConstants()

	// Init babel for JSX.
	babelRegister()

	// Load configurations.
	const conf = loadConfigurations().http

	// Start up fastify.
	const fastifyOptions = conf.ssl
		? {
			http2: conf.http2 === true,
			https: {
				allowHTTP1: true,
				key: await readFile(conf.ssl.key),
				cert: await readFile(conf.ssl.cert),
			},
			logger: !isProd,
			maxParamLength: 25,
		}
		: {
			logger: !isProd,
			maxParamLength: 25,
		}
	const app = await NestFactory.create<NestFastifyApplication>(
		AppModule,
		new FastifyAdapter(fastifyOptions),
	)

	// Fix issue for Prisma
	const prisma = app.get(Prisma)
	await prisma.enableShutdownHooks(app)

	// Setup fastify
	await setupFastify(app)
	setupBullMQ(app)

	// Listen
	await app.listen(conf.port, conf.host)
}

bootstrap()
