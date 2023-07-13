import { Injectable, UnauthorizedException } from '@nestjs/common'

import { toInternalError } from '../../utils/errors/toInternalError.js'
import { PrismaService } from '../utils/prisma.service.mjs'

import { comparePassword } from './password.util.mjs'

/** @sealed */
@Injectable()
export class SignInUseCase {
	readonly #prisma: PrismaService

	constructor(
		prisma: PrismaService,
	) {
		this.#prisma = prisma
	}

	async signIn(screenName: string, password: string) {
		const { id, password: encryptedPassword } = await this.#prisma.user.update({
			select: {
				id: true,
				password: true,
			},
			data: {
				lastSignedInAt: new Date(),
			},
			where: {
				screenname: screenName,
			},
		}).catch(toInternalError('notfound', 404))

		const isExact = await comparePassword(password, encryptedPassword)
		if (!isExact) {
			throw new UnauthorizedException()
		}

		return id as number
	}
}
