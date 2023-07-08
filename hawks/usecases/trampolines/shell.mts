import { isWin } from '../../utils/os.mjs'

import { __shellLinux } from './shell.linux.mjs'
import { __shellWindows } from './shell.windows.mjs'

export type ShellType = {
	spawnSync: (command: string, args: string[]) => string | null
	which: (command: string) => string | null
}

export const shell: ShellType = (() => {
	if (isWin) {
		return __shellWindows
	} else {
		return __shellLinux
	}
})()
