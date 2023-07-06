import { platform } from 'os'

import { __shellLinux } from './shell.linux.mjs'
import { __shellWindows } from './shell.windows.mjs'

export type ShellType = {
	spawnSync: (command: string, args: string[]) => string | null
	which: (command: string) => string | null
}

export const shell: ShellType = (() => {
	switch (platform()) {
	case 'win32':
		return __shellWindows
	default:
		return __shellLinux
	}
})()
