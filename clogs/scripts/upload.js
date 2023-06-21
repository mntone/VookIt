
const ALGORITHM_DICT = {
	sha256: 'SHA-256',
	sha384: 'SHA-384',
	sha512: 'SHA-512',
}

let info = null

/**
 * Get file hash as hex string
 * @param {string}                 hash
 * @param {File}                   file
 * @param {function(string): void} callback
 * @param {function(Error): void}  error
 */
function getFileHash(hash, file, callback, error) {
	file.arrayBuffer().then(buffer => {
		crypto.subtle.digest(ALGORITHM_DICT[hash], buffer).then(hashAsArrayBuffer => {
			const hashAsUint8Array = new Uint8Array(hashAsArrayBuffer)
			const hashAsString = Array
				.from(hashAsUint8Array)
				.map(binary => binary.toString(16).padStart(2, '0'))
				.join('')
			callback(hashAsString)
		})
	}, err => error?.(err))
}

/**
 * Check file format. Return error message if file is invalid.
 * @param   {File}    file
 * @returns {string?}
 */
function checkFile(file) {
	if (info) {
		if (file.size > info.maxFilesize) {
			return info?.messages.fileSize || 'File size is too large'
		}
		if (!info.supportedMimeType.includes(file.type)) {
			return info?.messages.mimeType || 'File is unsupported media type'
		}
	}
	return null
}

/**
 * Submit before check file format.
 */
function onFileChange() {
	const file = this.files[0]
	if (file) {
		const errorMessage = checkFile(file)
		if (errorMessage) {
			alert(errorMessage)
			return
		}

		const form = this.form
		getFileHash(info.useHashAlgorithm, file, hash => {
			const hashElem = document.createElement('input')
			Object.assign(hashElem, {
				type: 'hidden',
				name: 'hash',
				value: info.useHashAlgorithm + ':' + hash,
			})
			form.appendChild(hashElem)
			form.submit(form)
		}, () => form.submit(form))
	}
}

/**
 * Submit (fallback).
 */
function onFileChangeFallback() {
	const file = this.files[0]
	if (file) {
		const errorMessage = checkFile(file)
		if (errorMessage) {
			alert(errorMessage)
		} else {
			this.form.submit(this.form)
		}
	}
}

/**
 * @param {object}   args
 * @param {string}   args.targetId
 * @param {string}   args.useHashAlgorithm
 * @param {number}   args.maxFilesize
 * @param {string[]} args.supportedMimeType
 */
function installUpload(args) {
	info = args
	document.getElementById(args.targetId)
		.addEventListener('change', window.crypto ? onFileChange : onFileChangeFallback)
}

window.installUpload = installUpload
