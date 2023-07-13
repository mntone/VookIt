import { Injectable } from '@nestjs/common'

import { getEncryptedPassword } from '../authentications/password.util.mjs'
import { PrismaService } from '../utils/prisma.service.mjs'

/** @sealed */
@Injectable()
export class CreateUserUseCase {
	readonly #prisma: PrismaService

	constructor(
		prisma: PrismaService,
	) {
		this.#prisma = prisma
	}

	async create(screenName: string, password: string) {
		const encryptedPassword = await getEncryptedPassword(password)
		const user = await this.#prisma.user.create({
			data: {
				screenname: screenName,
				password: encryptedPassword,
			},
		})

		return user
	}
}
