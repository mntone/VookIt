import { Prisma } from '.prisma/client'
import { Injectable } from '@nestjs/common'

import { toInternalError } from '../../utils/errors/toInternalError.js'
import { PrismaService } from '../utils/prisma.service.mjs'
import ValidationError from '../ValidationError.js'

/** @sealed */
@Injectable()
export class FindPostByIdUseCase {
	readonly #prisma: PrismaService

	constructor(
		prisma: PrismaService,
	) {
		this.#prisma = prisma
	}

	async findById(
		id: number,
		options: { select: Prisma.PostSelect },
	) {
		// Find a post by id.
		const post = await this.#prisma.post.findUniqueOrThrow({
			select: options.select,
			where: {
				id,
			},
		}).catch(toInternalError('notfound', 404))

		return post
	}

	async findByIdWithValidation(
		id: number,
		options: { select: Prisma.PostSelect },
	) {
		if (id < 0) {
			throw new ValidationError('id')
		}

		return this.findById(id, options)
	}
}
