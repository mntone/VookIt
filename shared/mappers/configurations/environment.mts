import { Assign } from 'utility-types'

import {
	Configuration,
	ResourceConfiguration,
	SessionConfiguration,
} from '../../models/configurations/environment.mjs'
import { DateTimeSecString, ambiguousTermsToSeconds } from '../../utils/datetimeTerms.mjs'

type ResourceRawConfiguration = Assign<ResourceConfiguration, {
	readonly enableDeploy?: boolean
	readonly outputPath?: string
	readonly baseUri?: string
}>

type SessionRawConfiguration = Assign<SessionConfiguration, {
	readonly cookieMaxAge: DateTimeSecString | number
}>

type RawConfiguration = Assign<Configuration, {
	readonly assets?: ResourceRawConfiguration
	readonly media?: ResourceRawConfiguration
	readonly session: SessionRawConfiguration
}>

const normalizeResourceConfiguration = (
	raw: ResourceRawConfiguration | undefined,
	defaultOutputPath: string,
	defaultBaseUri: string,
): ResourceConfiguration => {
	let retValue: ResourceConfiguration
	if (raw) {
		retValue = {
			enableDeploy: raw.enableDeploy ?? true,
			outputPath: raw.outputPath ?? defaultOutputPath,
			baseUri: raw.baseUri ?? defaultBaseUri,
		}
	} else {
		retValue = {
			enableDeploy: true,
			outputPath: defaultOutputPath,
			baseUri: defaultBaseUri,
		}
	}
	return retValue
}

export const mapEnvironment = (raw: RawConfiguration): Configuration => {
	const {
		assets: rawAssets,
		media: rawMedia,
		session: rawSession,
		...others
	} = raw
	const retValue: Configuration = {
		...others,
		assets: normalizeResourceConfiguration(rawAssets, '.assets', '/a'),
		media: normalizeResourceConfiguration(rawMedia, '.media', '/m'),
		session: {
			cookieName: rawSession.cookieName,
			cookieMaxAge: ambiguousTermsToSeconds(rawSession.cookieMaxAge),
			key: rawSession.key,
		},
	}
	return retValue
}
