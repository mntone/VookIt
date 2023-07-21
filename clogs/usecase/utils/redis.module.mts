import { DynamicModule, Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'

import { RedisService } from './redis.service.mjs'

@Module({ })
export class RedisModule {
	static register(): DynamicModule {
		const providers = [RedisService]
		return {
			global: true,
			module: RedisModule,
			providers,
			imports: [ConfigModule],
			exports: providers,
		}
	}
}
