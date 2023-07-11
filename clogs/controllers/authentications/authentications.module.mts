import { Module } from '@nestjs/common'

import { SignInUseCase } from '../../usecase/authentications/signin.mjs'
import { Prisma } from '../../usecase/utils/prisma.mjs'

import { AuthenticationsController } from './authentications.controller.mjs'

@Module({
	controllers: [AuthenticationsController],
	providers: [
		Prisma,
		SignInUseCase,
	],
})
export class AuthenticationsModule { }
