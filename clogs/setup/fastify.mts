import { readFile } from 'fs/promises'
import { resolve } from 'path'

import fastifyMultipart from '@fastify/multipart'
import fastifySecureSession from '@fastify/secure-session'
import { NestFastifyApplication } from '@nestjs/platform-fastify'
// import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger'
import i18next from 'i18next'
import i18nextFsBackend from 'i18next-fs-backend'
// @ts-expect-error Fix no types
import i18nextMiddleware from 'i18next-http-middleware'
import { initReactI18next } from 'react-i18next'

import { loadConfigurations } from '../../configurations/configurations.mjs'
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

	// Set session.
	const conf = loadConfigurations()
	app.register(fastifySecureSession, {
		cookieName: conf.session.cookieName,
		cookie: {
			httpOnly: true,
			maxAge: conf.session.cookieMaxAge,
			path: '/',
			sameSite: 'lax',
			secure: conf.http.ssl != null,
		},
		secret: await readFile(conf.session.key),
	})

	// Set default renderer.
	const defaultHeaders: Record<string, string> = {
		'Referrer-Policy': 'no-referrer',
		'X-Content-Type-Options': 'nosniff',
		'X-Download-Options': 'noopen',
		'X-Frame-Options': 'DENY',
	}
	if (conf.http.ssl) {
		defaultHeaders['Strict-Transport-Security'] = 'max-age=' + (3 * 365 * 24 * 60 * 60).toString()
	}
	app.register(fastifyReactView, {
		defaultHeaders,
		root: './clogs/views/pages',
	})

	// Init multipart
	app.register(fastifyMultipart, {
		limits: {
			fileSize: Math.max(env.uploadMaxChunkSize as unknown as number, env.uploadMaxFileSize as unknown as number),
			headerPairs: 64,
		},
	})

	// Remove JSON and text type parser.
	const fastify = app.getHttpAdapter().getInstance()
	fastify.removeContentTypeParser(['application/json', 'text/plain'])

	// Deploy static assets.
	if (conf.assets.enableDeploy) {
		app.useStaticAssets({
			decorateReply: false,
			preCompressed: true,
			prefix: conf.assets.baseUri,
			root: resolve(conf.assets.outputPath),
		})
	}
	if (conf.media.enableDeploy) {
		app.useStaticAssets({
			decorateReply: false,
			prefix: conf.media.baseUri,
			root: resolve(conf.media.outputPath),
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
