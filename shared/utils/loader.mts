/* eslint-disable @typescript-eslint/no-explicit-any */
import { readFileSync } from 'fs'
import { readFile } from 'fs/promises'
import { join } from 'path'

import deepFreeze from 'deep-freeze'
import { load as yamlLoad } from 'js-yaml'

export async function load<T>(dirname: string, name: string, converter?: (obj: any) => T) {
	const filepath = join(dirname, name + '.yaml')
	const str = await readFile(filepath, 'utf8')
	const obj = yamlLoad(str)
	const conv = converter?.call(null, obj) ?? (obj as T)
	return deepFreeze(conv)
}

export function loadSync<T>(dirname: string, name: string, converter?: (obj: any) => T) {
	const filepath = join(dirname, name + '.yaml')
	const str = readFileSync(filepath, 'utf8')
	const obj = yamlLoad(str)
	const conv = converter?.call(null, obj) ?? (obj as T)
	return deepFreeze(conv)
}
