import { resolve } from 'path'

import { FastifyInstance } from 'fastify'
import fastifyPlugin from 'fastify-plugin'
import { I18NextRequest } from 'i18next-http-middleware'
import mnemonist from 'mnemonist'
import React, { createElement } from 'react'
import { renderToStaticNodeStream } from 'react-dom/server'

type ReactViewReply = {
	locals: I18NextRequest
}

declare module 'fastify' {
	// eslint-disable-next-line @typescript-eslint/no-empty-interface, @typescript-eslint/consistent-type-definitions
	interface FastifyReply extends ReactViewReply {}
}

type FastifyReactViewOptions = {
	cacheSize?: number

	charset?: string

	propertyName?: string

	root?: string

	ext?: string

	defaultHeaders?: Record<string, string>
}

export function getStream<P extends object>(elem: React.FunctionComponent<P>, props: P) {
	const node = createElement(elem, props)
	const stream = renderToStaticNodeStream(node)
	return stream
}

export function fastifyReactView(
	instance: FastifyInstance,
	opts: FastifyReactViewOptions,
	done: (err?: Error) => void,
) {
	const charset = opts.charset || 'utf-8'
	const propertyName = opts.propertyName || 'view'
	const root = opts.root || ''
	const ext = opts.ext || '.jsx'
	const defaultHeaders = Object.assign(opts.defaultHeaders || {}, {
		'Content-Type': 'text/html; charset=' + charset,
	})

	const cache = new mnemonist.LRUCache(opts.cacheSize ?? 100)

	instance.decorate(propertyName, {
		clearCache: () => {
			cache.clear()
		},
	})
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	instance.decorateReply(propertyName, async function (template: string, args: any) {
		let elem = cache.get(template)
		if (!elem) {
			const path = resolve(process.cwd(), root, template + ext)
			elem = await import(path)
		}

		if (args) {
			Object.assign(args, this.locals)
			args.session = this.request.session
		} else {
			args = {
				...this.locals,
				session: this.request.session,
			}
		}

		const stream = getStream(elem.default, args)
		await this.headers(defaultHeaders).send(stream)
	})

	done()
}

export default fastifyPlugin<FastifyReactViewOptions>(fastifyReactView, {
	fastify: '4.x',
	name: '@mntone/reactView',
})
