
export type SslConfiguration = {
	/**
	 * Key file path
	 */
	key: string

	/**
	 * Cert file path
	 */
	cert: string
}

export type HttpConfiguration = {
	/**
	 * Enable http2
	 */
	http2?: boolean

	/**
	 * Host name
	 */
	host: string

	/**
	 * Port number
	 */
	port: number

	/**
	 * SSL configuration
	 */
	ssl?: SslConfiguration
}

export type SessionConfiguration = {
	/**
	 * Session cookie name
	 */
	cookieName: string

	/**
	 * Session cookie max-age
	 */
	cookieMaxAge: number

	/**
	 * Key path
	 */
	key: string
}

export type Configuration = {
	/**
	 * Http configuration
	 */
	http: HttpConfiguration

	/**
	 * Session configuration
	 */
	session: SessionConfiguration
}
