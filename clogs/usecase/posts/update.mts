import { Injectable } from '@nestjs/common'
import { Prisma } from '@prisma/client'

import env from '../../../constants/env.js'
import { toInternalError } from '../../utils/errors/toInternalError.js'
import { PrismaService } from '../utils/prisma.service.mjs'
import ValidationError from '../ValidationError.js'

import { UpdatePostDto } from './dto/update.dto.mjs'

const visibilities = ['private', 'public']

/** @sealed */
@Injectable()
export class UpdatePostUseCase {
	readonly #prisma: PrismaService

	constructor(
		prisma: PrismaService,
	) {
		this.#prisma = prisma
	}

	async update(
		id: number,
		{ visibility, ...params }: UpdatePostDto,
	) {
		const data: Prisma.PostUpdateInput = params

		// Set visibility
		if (visibility) {
			if (visibility === 'public') {
				const currentPost = await this.#prisma.post.findFirstOrThrow({
					select: {
						published: true,
						publishedBy: true,
					},
					where: {
						id,
					},
				}).catch(toInternalError('notfound', 404))
				if (!currentPost.published) {
					data.published = true
					if (!currentPost.publishedBy) {
						data.publishedBy = new Date()
					}
				}
			}
		} else {
			data.published = false
		}

		// Update the target post by id.
		const post = await this.#prisma.post.update({
			select: {
				updatedBy: true,
			},
			data,
			where: {
				id,
			},
		}).catch(toInternalError('notfound', 404))

		// Convert JSON type
		/* eslint-disable camelcase */
		return {
			updated_at: post.updatedBy,
		}
		/* eslint-enable camelcase */
	}

	async updateWithValidation(
		id: number,
		params: UpdatePostDto,
	) {
		if (Number.isNaN(id)) {
			throw new ValidationError('id')
		}

		if (params.title) {
			const length = params.title.length
			if (length < env.titleLength.min) {
				throw new ValidationError('params.title')
			}
			if (length > env.titleLength.max) {
				throw new ValidationError('params.title')
			}
		}

		if (params.description) {
			const length = params.description.length
			if (length > env.descriptionMaximumLength) {
				throw new ValidationError('params.description')
			}
		}

		if (params.visibility && visibilities.includes(params.visibility)) {
			throw new ValidationError('params.visibility')
		}

		return this.update(id, params)
	}
}
