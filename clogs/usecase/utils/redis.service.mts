import {
	Injectable,
	OnModuleInit,
} from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { Redis } from 'ioredis'

import { Configuration, RedisConfiguration } from '../../../shared/models/configurations/environment.mjs'

@Injectable()
export class RedisService extends Redis implements OnModuleInit {
	constructor(config: ConfigService<Configuration>) {
		const conf = config.get<RedisConfiguration>('redis')
		super({
			...conf,
			lazyConnect: true,
			maxRetriesPerRequest: 0,
		})
	}

	async onModuleInit() {
		if (this.status === 'wait') {
			await this.connect()
		}
	}
}
