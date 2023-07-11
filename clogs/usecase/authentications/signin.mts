import { Injectable, UnauthorizedException } from '@nestjs/common'

import { toInternalError } from '../../utils/errors/toInternalError.js'
import { Prisma } from '../utils/prisma.mjs'

import { comparePassword } from './password.util.mjs'

@Injectable()
export class SignInUseCase {
	constructor(
		readonly _prisma: Prisma,
	) { }

	async signIn(screenName: string, password: string) {
		const { id, password: encryptedPassword } = await this._prisma.user.update({
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
