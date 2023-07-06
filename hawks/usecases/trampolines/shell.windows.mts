import { SpawnSyncOptionsWithStringEncoding, spawnSync } from 'child_process'

import { ShellType } from './shell.mjs'

const shellOptions: SpawnSyncOptionsWithStringEncoding = {
	encoding: 'utf8',
	shell: true,
	stdio: [null, 'pipe', null],
}

const __spawnSync = (command: string, args: string[]): string | null => {
	const { stdout } = spawnSync('chcp 65001>nul&' + command, args, shellOptions)
	return stdout
}

export const __shellWindows: ShellType = {
	spawnSync: __spawnSync,
	which: command => {
		const data = __spawnSync('where', [command])
		if (data) {
			return data.split(/\r?\n/, 2)[0]
		} else {
			return null
		}
	},
}
