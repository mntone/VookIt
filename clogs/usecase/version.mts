import { Injectable } from '@nestjs/common'

import { getGitHash, getSoftwareVersion } from '../utils/version.mjs'

const version = Object.freeze({
	name: 'VookIt!',
	version: getSoftwareVersion(),
	hash: getGitHash().slice(0, 7),
})

/** @sealed */
@Injectable()
export class VersionUseCase {
	get() {
		return version
	}
}
