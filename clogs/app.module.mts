import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'

import { loadConfigurations } from '../configurations/configurations.mjs'

import { ApisModule } from './controllers/apis/apis.module.mjs'
import { AuthenticationsModule } from './controllers/authentications/authentications.module.mjs'
import { RootModule } from './controllers/roots/roots.module.mjs'
import { PrismaModule } from './usecase/utils/prisma.module.mjs'

@Module({
	imports: [
		ConfigModule.forRoot({
			ignoreEnvFile: true,
			ignoreEnvVars: true,
			load: [loadConfigurations],
		}),
		RootModule,
		AuthenticationsModule,
		ApisModule,
		PrismaModule.register(),
	],
	exports: [
		PrismaModule,
	],
})
export class AppModule { }
