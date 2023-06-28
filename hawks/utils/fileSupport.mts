import { existsSync } from 'fs'
import { mkdir } from 'fs/promises'
import { join } from 'path'

// @ts-expect-error
import env from '../../constants/env.js'
import { EncodeData } from '../models/encoders/EncodeData.mjs'
import { Variant } from '../models/encoders/Variant.mjs'

export type FilepathOptions = {
	assumeDirectory: boolean
}

export function getInputDirname(data: EncodeData) {
	const inputDirname = join(env.mediaOutputDir, data.id)
	return inputDirname
}

export function getInputFilename(data: EncodeData) {
	const inputFilename = env.mediaOriginalFilename.replace('[ext]', data.ext)
	return inputFilename
}

export async function getInputFilepath(data: EncodeData, options?: FilepathOptions) {
	const inputDirname = getInputDirname(data)
	if (options?.assumeDirectory !== false && !existsSync(inputDirname)) {
		await mkdir(inputDirname, { recursive: true })
	}

	const inputFilename = getInputFilename(data)
	return join(inputDirname, inputFilename)
}

export function getOutputFilename(variant: Variant) {
	const outputFilename = variant.filename || variant.friendlyId + variant.fileExtension
	return outputFilename
}

export function getOutputDirname(id: string, isPublic: boolean) {
	const outputDirname = isPublic
		? join(env.mediaOutputDir, id)
		: join(env.mediaOutputDir, id, env.mediaPrivateDirname)
	return outputDirname
}

export async function getOutputFilepath(id: string, variant: Variant, options?: FilepathOptions) {
	const outputDirname = getOutputDirname(id, variant.public)
	if (options?.assumeDirectory !== false && !existsSync(outputDirname)) {
		await mkdir(outputDirname, { recursive: true })
	}

	const outputFilename = getOutputFilename(variant)
	return join(outputDirname, outputFilename)
}

export async function getEncodeFileinfo(data: EncodeData, variant: Variant, options?: FilepathOptions) {
	const inputFilepath = await getInputFilepath(data, options)
	const outputFilepath = await getOutputFilepath(data.id, variant, options)
	return {
		inputs: inputFilepath,
		output: outputFilepath,
	}
}

export function getCmafDirname(id: string, name: string) {
	const cmafDirname = join(env.mediaOutputDir, id, name)
	return cmafDirname
}

export function getCmafFilename() {
	return env.mediaDashFilename
}

export async function getCmafFilepath(id: string, name: string, options?: FilepathOptions) {
	const cmafDirname = getCmafDirname(id, name)
	if (options?.assumeDirectory !== false && !existsSync(cmafDirname)) {
		await mkdir(cmafDirname, { recursive: true })
	}

	const cmafFilename = getCmafFilename()
	return join(cmafDirname, cmafFilename)
}
