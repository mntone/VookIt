import {
	Controller,
	Get,
} from '@nestjs/common'

import version from '../../usecase/version.js'

@Controller('api')
export class ApisController {
	@Get('version')
	async version() {
		return version()
	}
}
