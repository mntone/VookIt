import {
	Controller,
	Get,
	Param,
	ParseIntPipe,
	Query,
	Render,
	UseFilters,
	UseGuards,
} from '@nestjs/common'
import { Prisma } from '@prisma/client'

import env from '../../../constants/env.js'
import { FindPostByIdUseCase } from '../../usecase/posts/findById.mjs'
import { FindPostsUseCase, FindPostsUseCaseOptions } from '../../usecase/posts/findMany.mjs'
import { HtmlPageExceptionFilter } from '../../utils/filters/htmlPageException.filter.mjs'
import { ParseUsidPipe } from '../../utils/pipes/parseUsid.pipe.mjs'
import { AuthenticationsGuard } from '../authentications/authentications.guard.mjs'

@Controller()
@UseFilters(HtmlPageExceptionFilter)
export class RootController {
	readonly #findPosts: FindPostsUseCase
	readonly #findPost: FindPostByIdUseCase

	constructor(
		findPosts: FindPostsUseCase,
		findPost: FindPostByIdUseCase,
	) {
		this.#findPosts = findPosts
		this.#findPost = findPost
	}

	@Get()
	@Render('TopPage')
	async create(
		@Query('until', new ParseIntPipe({ optional: true })) until?: number,
	) {
		const select: Prisma.PostSelect = {
			id: true,
			title: true,
			postedBy: true,
			published: true,
			publishedBy: true,
		}
		const limit = env.topMaxCount + 1
		const options: FindPostsUseCaseOptions = { select, limit }
		if (until) {
			options.untilDate = new Date(until)
		}
		const posts = await this.#findPosts.findMany(options)
		return {
			limit,
			until,
			firstPage: !until,
			posts,
		}
	}

	@Get('v/:usid')
	@Render('ViewPage')
	async view(
		@Param('usid', new ParseUsidPipe()) id: number,
	) {
		const select: Prisma.PostSelect = {
			title: true,
			description: true,
			postedBy: true,
			published: true,
			publishedBy: true,
			updatedBy: true,
		}
		// [TODO] Last-Modified
		const post = await this.#findPost.findById(id, { select })
		return {
			id,
			...post,
		}
	}

	@Get('e/:usid')
	@Render('EditPage')
	async edit(
		@Param('usid', new ParseUsidPipe()) id: number,
	) {
		const select: Prisma.PostSelect = {
			title: true,
			description: true,
			published: true,
		}
		const post = await this.#findPost.findById(id, { select })
		return {
			post: {
				id,
				...post,
			},
		}
	}

	@Get('upload')
	@Render('UploadPage')
	@UseGuards(AuthenticationsGuard)
	upload() {
		return null
	}

	@Get('login')
	@Render('signIn')
	signIn(
		@Query('r') redirect: string | undefined,
	) {
		return {
			redirect,
		}
	}
}
