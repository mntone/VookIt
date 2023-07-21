import { Assign } from 'utility-types'

import {
	Configuration,
	HttpConfiguration,
	ResourceConfiguration,
	SessionConfiguration,
} from '../../models/configurations/environment.mjs'
import { DateTimeSecString, ambiguousTermsToSeconds } from '../../utils/datetimeTerms.mjs'

type HttpRawConfiguration = Assign<HttpConfiguration, {
	readonly headers?: Record<string, string>
}>

type ResourceRawConfiguration = Assign<ResourceConfiguration, {
	readonly enableDeploy?: boolean
	readonly outputPath?: string
	readonly baseUri?: string
}>

type SessionRawConfiguration = Assign<SessionConfiguration, {
	readonly cookieMaxAge: DateTimeSecString | number
}>

type RawConfiguration = Assign<Configuration, {
	readonly http: HttpRawConfiguration
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
		http: { headers, ...rawHttp },
		assets: rawAssets,
		media: rawMedia,
		session: { cookieMaxAge, ...rawSession },
		...others
	} = raw
	const retValue: Configuration = {
		...others,
		http: {
			headers: headers ?? {
				'Referrer-Policy': 'no-referrer',
				'X-Content-Type-Options': 'nosniff',
				'X-Download-Options': 'noopen',
				'X-Frame-Options': 'DENY',
			},
			...rawHttp,
		},
		assets: normalizeResourceConfiguration(rawAssets, '.assets', '/a'),
		media: normalizeResourceConfiguration(rawMedia, '.media', '/m'),
		session: {
			...rawSession,
			cookieMaxAge: ambiguousTermsToSeconds(cookieMaxAge),
		},
	}
	return retValue
}
