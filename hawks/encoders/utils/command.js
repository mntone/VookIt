/**
 * @param   {object}           args
 * @param   {string|undefined} prefix
 * @returns {string[]}
 */
function toCommand(args, prefix = '-') {
	const command = Object
		.entries(args)
		.flatMap(kv => {
			/**
			 * @type {string[]}
			 */
			let ret
			if (kv[1] == null) {
				ret = [kv[0]]
			} else if (typeof kv[1] === 'boolean') {
				if (kv[1]) {
					ret = [prefix + kv[0]]
				} else {
					ret = []
				}
			} else if (Array.isArray(kv[1])) {
				const key = prefix + kv[0]
				ret = kv[1].flatMap(value => [key, value])
			} else {
				ret = [prefix + kv[0], kv[1]]
			}
			return ret
		})
	return command
}

module.exports = toCommand
