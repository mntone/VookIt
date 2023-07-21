import { readFileSync } from 'fs'

/**
 * Get software version
 * @returns The VookIt! version
 */
export function getSoftwareVersion() {
	const ver = process.env.npm_package_version
	if (ver != null) {
		return ver
	} else {
		const json = readFileSync('./package.json', 'utf8')
		const ver2: string = JSON.parse(json).version
		return ver2
	}
}

/**
 * Get git hash
 * @returns The git hash
 */
export function getGitHash() {
	try {
		const rev: string = readFileSync('.git/HEAD', 'utf8').trim()
		if (!rev.includes(':')) {
			return rev
		} else {
			return readFileSync('.git/' + rev.substring(5), 'utf8').trim()
		}
	} catch {
		return '?'.repeat(40)
	}
}
