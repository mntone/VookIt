import { Module } from '@nestjs/common'

import { SignInUseCase } from '../../usecase/authentications/signin.mjs'

import { AuthenticationsController } from './authentications.controller.mjs'

@Module({
	controllers: [AuthenticationsController],
	providers: [
		SignInUseCase,
	],
})
export class AuthenticationsModule { }
