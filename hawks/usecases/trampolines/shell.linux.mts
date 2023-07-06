import { SpawnSyncOptionsWithStringEncoding, spawnSync } from 'child_process'

import { ShellType } from './shell.mjs'

const shellOptions: SpawnSyncOptionsWithStringEncoding = {
	encoding: 'utf8',
	stdio: [null, 'pipe', null],
}

const __spawnSync = (command: string, args: string[]): string | null => {
	const { stdout } = spawnSync(command, args, shellOptions)
	return stdout
}

export const __shellLinux: ShellType = {
	spawnSync: __spawnSync,
	which: command => {
		const data = __spawnSync('which', [command])
		return data
	},
}
