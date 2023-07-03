import {
	Body,
	Controller,
	Delete,
	Header,
	HttpStatus,
	Post,
	Res,
	UsePipes,
	ValidationPipe,
} from '@nestjs/common'
import { Prisma } from '@prisma/client'
import fastify from 'fastify'

import createChunks from '../../../usecase/uploads/chunks/create.js'
import deleteChunks from '../../../usecase/uploads/chunks/delete.js'
import mergeChunks from '../../../usecase/uploads/chunks/merge.js'

import { CuidDto } from './dto/cuid.dto.mjs'
import { InitDto } from './dto/init.dto.mjs'

@Controller('api/upload')
export class UploadController {
	@Post('init')
	@UsePipes(new ValidationPipe({
		forbidNonWhitelisted: true,
		whitelist: true,
	}))
	@Header('Cache-Control', 'private, no-store')
	async init(
		@Body() body: InitDto,
	) {
		const select: Prisma.UploadSelect = {
			cuid: true,
			startedAt: true,
		}
		const upload = await createChunks(
			body.name,
			body.size,
			body.hash,
			{ select },
		)
		return upload
	}

	@Post('merge')
	@UsePipes(new ValidationPipe({
		forbidNonWhitelisted: true,
		whitelist: true,
	}))
	@Header('Cache-Control', 'private, no-store')
	async merge(
		@Res() reply: fastify.FastifyReply,
		@Body() body: CuidDto,
	) {
		const lacksOrPost = await mergeChunks(body.cuid, 'dev')
		if (Array.isArray(lacksOrPost)) {
			reply.statusCode = HttpStatus.FAILED_DEPENDENCY
		}
		return lacksOrPost
	}

	@Delete()
	@UsePipes(new ValidationPipe({
		forbidNonWhitelisted: true,
		whitelist: true,
	}))
	@Header('Cache-Control', 'private, no-store')
	async cancel(
		@Body() body: CuidDto,
	) {
		await deleteChunks(body.cuid)
		return { }
	}
}
