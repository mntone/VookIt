import {
	ArgumentsHost,
	ExceptionFilter,
	HttpException,
	UnauthorizedException,
} from '@nestjs/common'
import fastify from 'fastify'

import ErrorPage from '../../views/pages/ErrorPage.jsx'
import InternalError from '../errors/InternalError.js'
import { getStream } from '../fastifyReactView.mjs'

export class HtmlPageExceptionFilter implements ExceptionFilter {
	catch(exception: HttpException | InternalError, host: ArgumentsHost): void {
		const ctx = host.switchToHttp()
		const req = ctx.getRequest<fastify.FastifyRequest>()
		const res = ctx.getResponse<fastify.FastifyReply>()
		let description
		if (exception instanceof InternalError) {
			description = req.t('error.' + exception.fieldName)
				+ ' (' + req.t('errorpage.message').replace('%d', exception.statusCode.toString()) + ')'
		} else if (exception instanceof UnauthorizedException) {
			description = req.t('error.unauthorized')
		} else {
			description = req.t('errorpage.message').replace('%d', exception.getStatus().toString())
		}
		const stream = getStream(ErrorPage, {
			t: req.t,
			language: req.language,
			session: req.session,
			description,
		})
		res
			.header('Content-Type', 'text/html; charset=utf-8')
			.send(stream)
	}
}
