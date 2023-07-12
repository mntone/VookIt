
export type SslConfiguration = {
	/**
	 * Key file path
	 */
	readonly key: string

	/**
	 * Cert file path
	 */
	readonly cert: string
}

export type HttpConfiguration = {
	/**
	 * Enable http2
	 */
	readonly http2?: boolean

	/**
	 * Host name
	 */
	readonly host: string

	/**
	 * Port number
	 */
	readonly port: number

	/**
	 * SSL configuration
	 */
	readonly ssl?: SslConfiguration
}

export type SessionConfiguration = {
	/**
	 * Session cookie name
	 */
	readonly cookieName: string

	/**
	 * Session cookie max-age
	 */
	readonly cookieMaxAge: number

	/**
	 * Key path
	 */
	readonly key: string
}

export type Configuration = {
	/**
	 * Http configuration
	 */
	readonly http: HttpConfiguration

	/**
	 * Session configuration
	 */
	readonly session: SessionConfiguration
}
