import { readFile } from 'fs/promises'

// @ts-expect-error Fix no types.
import babelRegister from '@babel/register'
import { NestFactory } from '@nestjs/core'
import { FastifyAdapter, NestFastifyApplication } from '@nestjs/platform-fastify'

import env from '../constants/env.js'
import initConstants from '../constants/init.js'

import { AppModule } from './app.module.mjs'
import { setupBullMQ } from './setup/bullmq.mjs'
import { setupFastify } from './setup/fastify.mjs'

async function bootstrap() {
	const isProd = process.env.NODE_ENV !== 'development'

	// Init shared variables.
	initConstants()

	// Init babel for JSX.
	babelRegister()

	// Start up fastify.
	const fastifyOptions = {
		http2: true,
		https: {
			allowHTTP1: true,
			key: await readFile(env.sslKeyFile),
			cert: await readFile(env.sslCertFile),
		},
		logger: !isProd,
		maxParamLength: 25,
	}
	const app = await NestFactory.create<NestFastifyApplication>(
		AppModule,
		new FastifyAdapter(fastifyOptions),
	)
	await setupFastify(app)
	setupBullMQ(app)
	await app.listen(env.port)
}

bootstrap()
