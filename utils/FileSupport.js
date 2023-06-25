const { existsSync, mkdirSync } = require('fs')
const { mkdir } = require('fs/promises')

/**
 * @param   {import('fs').PathLike} path
 * @returns {Promise<void>}
 */
async function mkdirIfNeeded(path) {
	if (!existsSync(path)) {
		await mkdir(path, { recursive: true })
	}
}

/**
 * @param {import('fs').PathLike} path
 */
function mkdirSyncIfNeeded(path) {
	if (!existsSync(path)) {
		mkdirSync(path, { recursive: true })
	}
}

module.exports = {
	mkdirIfNeeded,
	mkdirSyncIfNeeded,
}
