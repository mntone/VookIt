import {
	Controller,
	Get,
} from '@nestjs/common'

import { VersionUseCase } from '../../usecase/version.mjs'

@Controller('api')
export class ApisController {
	readonly #version: VersionUseCase

	constructor(
		version: VersionUseCase,
	) {
		this.#version = version
	}

	@Get('version')
	async version() {
		return this.#version.get()
	}
}
