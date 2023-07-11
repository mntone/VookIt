import { Injectable } from '@nestjs/common'

import { getEncryptedPassword } from '../authentications/password.util.mjs'
import { Prisma } from '../utils/prisma.mjs'

@Injectable()
export class CreateUserUseCase {
	constructor(
		readonly _prisma: Prisma,
	) { }

	async create(screenName: string, password: string) {
		const encryptedPassword = await getEncryptedPassword(password)
		const user = await this._prisma.user.create({
			data: {
				screenname: screenName,
				password: encryptedPassword,
			},
		})

		return user
	}
}
