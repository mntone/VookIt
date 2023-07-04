import {
	Body,
	Controller,
	Delete,
	Header,
	HttpStatus,
	Post,
	Req,
	Res,
	UseInterceptors,
	UsePipes,
	ValidationPipe,
} from '@nestjs/common'
import { Prisma } from '@prisma/client'
import fastify from 'fastify'

import createChunks from '../../../usecase/uploads/chunks/create.js'
import deleteChunks from '../../../usecase/uploads/chunks/delete.js'
import mergeChunks from '../../../usecase/uploads/chunks/merge.js'
import sendChunk from '../../../usecase/uploads/chunks/send.js'
import createFile from '../../../usecase/uploads/create.js'
import { FileInterceptor } from '../../../utils/interceptors/file.interceptor.mjs'

import { CuidDto } from './dto/cuid.dto.mjs'
import { InitDto } from './dto/init.dto.mjs'
import { SendDto } from './dto/send.dto.mjs'
import { SendFileDto } from './dto/sendFile.dto.mjs'

@Controller('api/upload')
export class UploadController {
	@Post()
	@UseInterceptors(FileInterceptor('file', {
		limits: {
			fieldNameSize: 4,	/* file, hash */
			fieldSize: 96,		/* "sha512-...(base64)" */
			fields: 1,
			files: 1,
			parts: 2,
		},
	}))
	@UsePipes(new ValidationPipe({
		forbidNonWhitelisted: true,
		whitelist: true,
	}))
	@Header('Cache-Control', 'private, no-store')
	async sendFile(
		@Req() req: fastify.FastifyRequest,
		@Res() reply: fastify.FastifyReply,
		@Body() body: SendFileDto,
	) {
		const post = await createFile(body.hash, body.file, 'dev')
		if (req.type(['text/html']) === 'text/html') {
			reply.redirect(302, '/e/' + post.usid)
		} else {
			reply.send(post)
		}
	}

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

	@Post('send')
	@UseInterceptors(FileInterceptor('chunked_file', {
		limits: {
			fieldNameSize: 12,	/* chunked_file, hash, cuid, index */
			fieldSize: 96,		/* "sha512-...(base64)" */
			fields: 3,
			files: 1,
			parts: 4,
		},
	}))
	@UsePipes(new ValidationPipe({
		forbidNonWhitelisted: true,
		whitelist: true,
	}))
	@Header('Cache-Control', 'private, no-store')
	async send(
		@Body() body: SendDto,
	) {
		await sendChunk(body.cuid, body.index, body.hash, body.chunked_file)
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
		reply.send(lacksOrPost)
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
	}
}
