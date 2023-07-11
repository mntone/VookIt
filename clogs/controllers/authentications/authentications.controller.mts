import fastifySecureSession from '@fastify/secure-session'
import {
	Body,
	Controller,
	Get,
	HttpCode,
	HttpStatus,
	Post,
	Query,
	Res,
	Session,
	UsePipes,
	ValidationPipe,
} from '@nestjs/common'
import fastify from 'fastify'

import { SignInUseCase } from '../../usecase/authentications/signin.mjs'

import { SignInDto } from './dto/signIn.dto.mjs'

@Controller('auth')
export class AuthenticationsController {
	constructor(readonly _signIn: SignInUseCase) { }

	@HttpCode(HttpStatus.OK)
	@Post('login')
	@UsePipes(new ValidationPipe({
		forbidNonWhitelisted: true,
		whitelist: true,
	}))
	async signIn(
		@Res() reply: fastify.FastifyReply,
		@Body() body: SignInDto,
		@Session() session: fastifySecureSession.Session,
	) {
		const id = await this._signIn.signIn(body.screenname, body.password)
		session.uid = id

		// Redirect
		reply.redirect(302, body.redirect ? body.redirect : '/')
	}

	@HttpCode(HttpStatus.OK)
	@Get('logout')
	signOut(
		@Res() reply: fastify.FastifyReply,
		@Query('r') redirect: string | undefined,
		@Session() session: fastifySecureSession.Session,
	) {
		session.delete()

		// Redirect
		reply.redirect(302, redirect ? redirect : '/')
	}
}
