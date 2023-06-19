/**
 *
 * @param   {string} usid URL safe base64 encoded ID
 * @returns {bigint}      ID as BigInt
 */
function toId(usid) {
	const buffer = Buffer.from(usid, 'base64url')
	let id = 0n
	for (let i = buffer.length - 1; i >= 0; --i) {
		id = (id << 8n) | BigInt(buffer[i])
	}
	return id
}

/**
 *
 * @param   {string} usid URL safe base64 encoded ID
 * @returns {number}      ID as Number
 */
function toIdAsNumber(usid) {
	const buffer = Buffer.from(usid, 'base64url')
	let id = 0
	for (let i = buffer.length - 1; i >= 0; --i) {
		id = (id << 8) | buffer[i]
	}
	return id
}

/**
 * @param   {bigint} id ID as BigInt
 * @returns {string}    URL safe base64 encoded ID
 */
function toUsid(id) {
	if (id <= 0 || id >= BigInt.MAX_SAFE_INTEGER) {
		throw Error(`This id (${id}) is invalid.`)
	}

	const count = Math.ceil(id.toString(2).length / 8)
	const chunk = new Uint8Array(count)
	for (let i = 0; i < count; ++i) {
		const mod = BigInt.asUintN(8, id)
		chunk[i] = Number(mod)
		id >>= 8n
	}

	const buffer = Buffer.from(new Uint8Array(chunk).buffer)
	const base64url = buffer.toString('base64url')
	return base64url
}

/**
 * @param   {number} num ID as Number
 * @returns {string}     URL safe base64 encoded ID
 */
function numToUsid(num) {
	const id = BigInt(num)
	return toUsid(id)
}

module.exports = {
	toId,
	toIdAsNumber,
	toUsid,
	numToUsid,
}
