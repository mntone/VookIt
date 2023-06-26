import camelCase from 'lodash.camelcase'

export function camelCasify<T extends Record<string, unknown> | unknown[]>(obj: T) {
	/* eslint-disable @typescript-eslint/no-explicit-any */
	if (Array.isArray(obj)) {
		return obj.reduce((result: unknown[], value, index) => {
			result[index] = typeof value === 'object' ? camelCasify(value as any) : value
			return result
		}, [])
	} else {
		return Object.keys(obj).reduce((result: Record<string, unknown>, key) => {
			const camelCaseKey = camelCase(key)
			const value = obj[key]
			result[camelCaseKey] = typeof value === 'object' ? camelCasify(value as any) : value
			return result
		}, {})
	}
	/* eslint-enable @typescript-eslint/no-explicit-any */
}
