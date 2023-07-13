import { Prisma } from '.prisma/client'
import { Injectable } from '@nestjs/common'

import env from '../../../constants/env.js'
import { PrismaService } from '../utils/prisma.service.mjs'
import ValidationError from '../ValidationError.js'

export type FindPostsUseCaseOptions = {
	untilDate?: Date

	maxId?: number

	limit?: number

	select?: Prisma.PostSelect
}

/** @sealed */
@Injectable()
export class FindPostsUseCase {
	readonly #prisma: PrismaService

	constructor(
		prisma: PrismaService,
	) {
		this.#prisma = prisma
	}

	async findMany(
		options?: FindPostsUseCaseOptions,
	) {
		// Define limits.
		options = options || {}
		options.limit = options.limit || 10

		let where: Prisma.PostWhereInput | undefined
		if (options.untilDate != null) {
			where = {
				postedBy: { lte: options.untilDate },
				published: { equals: true },
			}
		} else if (options.maxId != null) {
			where = {
				id: { lte: options.maxId },
				published: { equals: true },
			}
		} else {
			where = {
				published: { equals: true },
			}
		}

		// Find posts.
		const posts = await this.#prisma.post.findMany({
			select: options.select,
			where,
			orderBy: {
				postedBy: 'desc',
			},
			take: options.limit,
		})

		return posts
	}

	async findManyWithValidation(
		options: FindPostsUseCaseOptions,
	) {
		if (options.limit && options.limit > env.postFetchingLimit) {
			throw new ValidationError('options.limit')
		}

		return this.findMany(options)
	}
}
