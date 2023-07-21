import {
	Body,
	Controller,
	Header,
	Param,
	Patch,
	Post,
	Res,
	UsePipes,
	ValidationPipe,
} from '@nestjs/common'
import fastify from 'fastify'

import { UpdatePostDto } from '../../../usecase/posts/dto/update.dto.mjs'
import { UpdatePostUseCase } from '../../../usecase/posts/update.mjs'
import { ParseUsidPipe } from '../../../utils/pipes/parseUsid.pipe.mjs'

import { EditDto, PatchableEditDto } from './dto/edit.dto.mjs'

@Controller('api/post')
export class PostController {
	readonly #updatePost: UpdatePostUseCase

	constructor(
		updatePost: UpdatePostUseCase,
	) {
		this.#updatePost = updatePost
	}

	@Post(':usid.html')
	@UsePipes(new ValidationPipe({
		forbidNonWhitelisted: true,
		whitelist: true,
	}))
	@Header('Cache-Control', 'private, no-store')
	async updateHtml(
		@Res() reply: fastify.FastifyReply,
		@Param('usid') usid: string,
		@Param('usid', new ParseUsidPipe()) id: number,
		@Body() body: EditDto,
	) {
		await this.#updatePost.update(id, body as UpdatePostDto)
		reply.redirect(302, '/v/' + usid)
	}

	@Patch(':usid')
	@UsePipes(new ValidationPipe({
		forbidNonWhitelisted: true,
		skipMissingProperties: true,
		whitelist: true,
	}))
	@Header('Cache-Control', 'private, no-store')
	async update(
		@Param('usid', new ParseUsidPipe()) id: number,
		@Body() body: PatchableEditDto,
	) {
		const post = await this.#updatePost.update(id, body as UpdatePostDto)
		return post
	}
}
