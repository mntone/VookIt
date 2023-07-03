import { resolve } from 'path'

import acceptsSerializer from '@fastify/accepts-serializer'
import { NestFastifyApplication } from '@nestjs/platform-fastify'
// import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger'
import i18next from 'i18next'
import i18nextFsBackend from 'i18next-fs-backend'
// @ts-expect-error Fix no types
import i18nextMiddleware from 'i18next-http-middleware'
import yaml from 'js-yaml'
import { pack, unpack } from 'msgpackr'
import { initReactI18next } from 'react-i18next'

import env from '../../constants/env.js'
import fastifyReactView from '../utils/fastifyReactView.mjs'

export async function setupFastify(app: NestFastifyApplication) {
	// Init i18n
	await i18next
		.use(i18nextFsBackend)
		.use(i18nextMiddleware.LanguageDetector)
		.use(initReactI18next)
		.init({
			backend: {
				loadPath: 'clogs/locales/{{lng}}.yaml',
			},
			detection: {
				order: ['header', 'querystring'],
				lookupQuerystring: 'lang',
			},
			fallbackLng: 'en',
		})
	app.register(i18nextMiddleware.plugin, { i18next })

	// Set default renderer.
	app.register(fastifyReactView, {
		defaultHeaders: {
			'X-Content-Type-Options': 'nosniff',
		},
		root: './clogs/views/pages',
	})

	app.register(acceptsSerializer, {
		default: 'application/msgpack',
		serializers: [
			{
				regex: /^application\/json$/,
				serializer: body => JSON.stringify(body),
			},
			{
				regex: /^application\/msgpack$/,
				// @ts-expect-error Returns binary data. But, return type is string only.
				serializer: body => pack(body),
			},
			{
				regex: /^application\/yaml$/,
				serializer: body => yaml.dump(body),
			},
		],
		prefix: '/api',
	})

	const fastify = app.getHttpAdapter().getInstance()
	fastify.removeContentTypeParser(['text/plain'])
	fastify.addContentTypeParser(
		['application/msgpack', 'application/x-msgpack'],
		{
			bodyLimit: 512 * 1024,
			parseAs: 'buffer',
		},
		(_, body, done) => {
			try {
				const res = unpack(body as Uint8Array)
				done(null, res)
			} catch (err) {
				// eslint-disable-next-line @typescript-eslint/no-explicit-any
				(err as any).statusCode = 400
				done(err as Error)
			}
		})

	// Deploy static assets.
	if (env.staticDeployEnabled) {
		app
			.useStaticAssets({
				decorateReply: false,
				preCompressed: true,
				prefix: '/a',
				root: resolve('./.assets'),
			})
			.useStaticAssets({
				decorateReply: false,
				prefix: env.mediaRootPath,
				root: resolve(env.mediaOutputDir),
			})
	}

	// Add documents.
	// if (process.env.NODE_ENV === 'development') {
	// 	const config = new DocumentBuilder()
	// 		.setTitle('VookIt!')
	// 		.setDescription('VookIt! API Description')
	// 		.setVersion('0.8')
	// 		.build()
	// 	const document = SwaggerModule.createDocument(app, config)
	// 	SwaggerModule.setup('doc', app, document)
	// }
}
