import {
	INestApplication,
	Injectable,
	OnModuleInit,
} from '@nestjs/common'
import { PrismaClient } from '@prisma/client'

@Injectable()
export class Prisma extends PrismaClient implements OnModuleInit {
	async onModuleInit() {
		await this.$connect()
	}

	async enableShutdownHooks(app: INestApplication) {
		this.$on('beforeExit', app.close)
	}
}
