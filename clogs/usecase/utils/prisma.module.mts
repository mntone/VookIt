import { DynamicModule, Module } from '@nestjs/common'

import { PrismaService } from './prisma.service.mjs'

@Module({ })
export class PrismaModule {
	static register(): DynamicModule {
		const providers = [PrismaService]
		return {
			global: true,
			module: PrismaModule,
			providers,
			exports: providers,
		}
	}
}
