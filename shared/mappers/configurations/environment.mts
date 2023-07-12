import { Assign } from 'utility-types'

import { Configuration, SessionConfiguration } from '../../models/configurations/environment.mjs'
import { DateTimeSecString, ambiguousTermsToSeconds } from '../../utils/datetimeTerms.mjs'

type SessionRawConfiguration = Assign<SessionConfiguration, {
	readonly cookieMaxAge: DateTimeSecString | number
}>

type RawConfiguration = Assign<Configuration, {
	readonly readonlysession: SessionRawConfiguration
}>

export const mapEnvironment = (raw: RawConfiguration): Configuration => {
	const retValue: Configuration = {
		http: raw.http,
		session: {
			cookieName: raw.session.cookieName,
			cookieMaxAge: ambiguousTermsToSeconds(raw.session.cookieMaxAge),
			key: raw.session.key,
		},
	}
	return retValue
}
