
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

export type Configuration = {
	/**
	 * Http configuration
	 */
	http: HttpConfiguration
}
