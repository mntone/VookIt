import { readFileSync } from 'fs'
import { readFile } from 'fs/promises'
import { join } from 'path'

import { load as yamlLoad } from 'js-yaml'

export async function load<T>(dirname: string, name: string) {
	const filepath = join(dirname, name + '.yaml')
	const str = await readFile(filepath, 'utf8')
	const obj = yamlLoad(str) as T
	return obj
}

export function loadSync<T>(dirname: string, name: string) {
	const filepath = join(dirname, name + '.yaml')
	const str = readFileSync(filepath, 'utf8')
	const obj = yamlLoad(str) as T
	return obj
}
