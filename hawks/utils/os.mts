import { platform } from 'os'

export const isWin = platform() === 'win32'
export const isMac = platform() === 'darwin'
