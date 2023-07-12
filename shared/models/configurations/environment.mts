
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

export type ResourceConfiguration = {
	/**
	 * Enable deploy
	 */
	enableDeploy: boolean

	/**
	 * Media output path
	 */
	outputPath: string

	/**
	 * Media base URI
	 */
	baseUri: string
}

export type RedisConfiguration = {
	/**
	 * Host name
	 */
	readonly host?: string

	/**
	 * Port number
	 */
	readonly port: number

	/**
	 * User name
	 */
	readonly username?: string

	/**
	 * Password
	 */
	readonly password?: string
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
	 * Assets configuration
	 */
	readonly assets: ResourceConfiguration

	/**
	 * Media configuration
	 */
	readonly media: ResourceConfiguration

	/**
	 * Redis configuration
	 */
	readonly redis: RedisConfiguration

	/**
	 * Session configuration
	 */
	readonly session: SessionConfiguration
}
