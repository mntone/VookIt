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

import updatePost from '../../../usecase/posts/update.js'
import { ParseUsidPipe } from '../../../utils/pipes/parseUsid.pipe.mjs'

import { EditDto, PatchableEditDto } from './dto/edit.dto.mjs'

@Controller('api/post')
export class PostController {
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
		await updatePost(id, body)
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
		const post = await updatePost(id, body)
		return post
	}
}
