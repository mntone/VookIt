import { Module } from '@nestjs/common'

import { ApisModule } from './controllers/apis/apis.module.mjs'
import { RootModule } from './controllers/roots/roots.module.mjs'

@Module({
	imports: [
		RootModule,
		ApisModule,
	],
})
export class AppModule { }
