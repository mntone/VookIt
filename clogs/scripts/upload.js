
/**
 * @typedef ChunkUploadOptions
 * @property {string} hashAlgorithm Hash algorithm
 * @property {number} chunkSize     Chunk size
 * @property {number} maxRetries    Max retry count
 */

/**
 * @typedef ChunkUploadProgress
 * @property {string}             cuid    Cuid
 * @property {File}               file    File
 * @property {boolean[]}          chunks  Statuses
 * @property {ChunkUploadOptions} options Options
 */

const ENDPOINTS = Object.freeze({
	init: '/api/upload/init',
	send: '/api/upload/send',
	merge: '/api/upload/merge',
})

const ALGORITHM_DICT = Object.freeze({
	sha256: 'SHA-256',
	sha384: 'SHA-384',
	sha512: 'SHA-512',
})

const subtle = window.crypto && (crypto.subtle || crypto.webkitSubtle)

/**
 * Get preferred filename.
 * @param   {string}             filename Filename
 * @param   {ChunkUploadOptions} options  Chunk upload options
 * @returns {string}                      Preferred filename
 */
function getPreferredFilename(filename, options) {
	if (options.dropFilename) {
		const fileext = filename.split('.').at(-1)
		return 'video.' + fileext
	} else {
		return filename
	}
}

/**
 * Get hash as base64 string
 * @param   {Uint8Array} binary Array of UInt8
 * @returns {string}            Hash as Base64 String
 */
function binaryToBase64String(binary) {
	const hashAsBinaryString = Array
		.from(binary)
		.map(binary => String.fromCharCode(binary))
		.join('')
	const hashAsBase64String = btoa(hashAsBinaryString)
	return hashAsBase64String
}

/**
 * Get blob hash as hex string
 * @param   {string}          hash Hash algorithm
 * @param   {Blob}            blob Binary data
 * @returns {Promise<string>}      Promise of hash string
 */
function getBlobHash(hash, blob) {
	return blob.arrayBuffer().then(buffer => {
		return subtle.digest(ALGORITHM_DICT[hash], buffer).then(hashAsArrayBuffer => {
			const hashAsUint8Array = new Uint8Array(hashAsArrayBuffer)
			const hashAsString = binaryToBase64String(hashAsUint8Array)
			return hash + '-' + hashAsString
		})
	})
}

/**
 *
 * @template T
 * @param   {() => Promise<T>}             task
 * @param   {(retries: number) => boolean} cond
 * @returns {Promise<T>}
 */
function retryPromise(task, cond) {
	return new Promise((resolve, reject) => {
		/**
		 *
		 * @param {number} count Retry count
		 */
		function exec(count) {
			task().then(resolve, reason => {
				if (cond(count)) {
					exec(count + 1)
				} else {
					reject(reason)
				}
			})
		}
		exec(0)
	})
}

/**
 * @type {RequestInit}
 */
const defaultInit = {
	method: 'POST',
	mode: 'same-origin',
	redirect: 'manual',
	referrer: '',
}

/**
 * Submit merge.
 * @param {ChunkUploadProgress} progress Progress object
 */
function submitMerge(progress) {
	const body = new URLSearchParams()
	body.append('cuid', progress.cuid)
	const init = Object.assign({ body }, defaultInit)
	retryPromise(
		() => fetch(ENDPOINTS.merge, init),
		c => c < progress.options.maxRetries,
	).then(res => {
		if (!res.ok) {
			if (res.status === 424) {
				res.json().then(json => {
					json.forEach(i => progress.chunks[i] = false)
					submitChunksBy(progress)
				})
				return
			}
			if (res.status === 400) {
				console.log('Unrecoverable error.')
				return
			}
			throw Error('Unknown error.')
		}

		res.json().then(json => {
			location.href = '/e/' + json.usid
		})
	})
}

/**
 * Submit a chunked file.
 * @param   {number}            index    Chunk index
 * @param                       progress Progress object
 * @returns {Promise<Response>}          Response
 */
function submitChunk(index, progress) {
	const p = index * progress.options.chunkSize
	const chunk = progress.file.slice(p, p + progress.options.chunkSize)
	return getBlobHash(progress.options.hashAlgorithm, chunk).then(hashdata => {
		const body = new FormData()
		body.append('cuid', progress.cuid)
		body.append('index', index.toString())
		body.append('hash', hashdata)
		body.append('chunked_file', chunk)
		const init = Object.assign({ body }, defaultInit)
		const task = retryPromise(
			() => fetch(ENDPOINTS.send, init),
			c => c < progress.options.maxRetries,
		)
		task.then(res => {
			if (!res.ok) {
				if (res.status === 400) {
					console.log('Unrecoverable error.')
					return
				}
				throw Error('Unknown error.')
			}

			progress.chunks[index] = true
			if (progress.chunks.every(f => f)) {
				submitMerge(progress)
			}
		})
		return task
	})
}

/**
 * Submit chunks by progress.
 * @param {ChunkUploadProgress} progress Progress object
 */
function submitChunksBy(progress) {
	for (const [index, status] of Object.entries(progress.chunks)) {
		if (!status) {
			submitChunk(index, progress)
		}
	}
}

/**
 * Submit chunks by progress.
 * @param {number}              index
 * @param {Promise<Response>[]} taskPool
 * @param {ChunkUploadProgress} progress Progress object
 */
function submitChunksFrom(index, taskPool, progress) {
	for (; index < progress.chunks.length; ++index) {
		const task = submitChunk(index, progress)
		taskPool.push(task)
		if (taskPool.length === progress.options.maxConns) {
			Promise.race(taskPool).then(() => {
				submitChunksFrom(index + 1, taskPool, progress)
			})
			break
		}
	}
}

/**
 * Submit chunks.
 * @param {File}               file
 * @param {string}             cuid
 * @param {ChunkUploadOptions} options
 */
function submitChunks(file, cuid, options) {
	const chunks = Math.ceil(file.size / options.chunkSize)
	const progress = {
		cuid,
		file,
		chunks: Array.from({ length: chunks }, () => false),
		options,
	}
	submitChunksFrom(0, [], progress)
}

/**
 * Init chunked file upload.
 * @param {File}               file
 * @param {ChunkUploadOptions} options
 */
function initChunks(file, options) {
	getBlobHash(options.hashAlgorithm, file).then(hashdata => {
		const body = new URLSearchParams()
		body.append('name', getPreferredFilename(file.name, options))
		body.append('size', file.size)
		body.append('hash', hashdata)
		const init = Object.assign({ body }, defaultInit)
		retryPromise(
			() => fetch(ENDPOINTS.init, init),
			c => c < options.maxRetries,
		).then(res => {
			if (!res.ok) {
				console.log('Unrecoverable error.')
				return
			}

			res.json().then(json => {
				const cuid = json.cuid
				submitChunks(file, cuid, options)
			})
		})
	})
}

let info = null

/**
 * Submit with hashdata
 * @param {File}            file
 * @param {HTMLFormElement} form
 */
function submitWithHashdata(file, form) {
	getBlobHash(info.hashAlgorithm, file).then(hashdata => {
		const hashElem = document.createElement('input')
		Object.assign(hashElem, {
			type: 'hidden',
			name: 'hash',
			value: hashdata,
		})
		form.appendChild(hashElem)
		form.submit(form)
	}, () => form.submit(form))
}

/**
 * Check file format. Return error message if file is invalid.
 * @param   {File}    file
 * @param   {number}  maxSize
 * @param   {string}  customMessage
 * @returns {string?}
 */
function checkFile(file, maxSize, customMessage) {
	if (file.size > maxSize) {
		return customMessage || info.messages.fileSize || 'File size is too large'
	}
	if (!info.supportedMimeType.includes(file.type)) {
		return info.messages.mimeType || 'File is unsupported media type'
	}
	return null
}

let validationElement = null

/**
 * Show error message
 * @param {string} message Error message
 */
function showErrorMessage(message) {
	if (validationElement) {
		validationElement.textContent = message
	} else {
		alert(message)
	}
}

/**
 * Handle file changes
 */
function onFileChange() {
	validationElement.textContent = null

	const file = this.files[0]
	if (file) {
		const form = this.form

		// [File API] Edge 12+, Chrome 6+, Firefox 3.6+, Safari 5.1+
		// https://caniuse.com/fileapi
		if (info && window.File) {
			// [Web Cryptography] Edge 12+, Chrome 37+, Firefox 34+, Safari 11+ ("webkitSubtle" 7.1+)
			// https://caniuse.com/cryptography
			if (subtle) {
				// [Fetch] Edge 14+, Chrome 42, Firefox 39+, Safari 10.1+
				// https://caniuse.com/fetch
				if (window.fetch && file.size >= info.sizes.file) {
					// Submit as chunked files.
					const errorMessage = checkFile(file, info.sizes.total, info.messages.totalSize)
					if (errorMessage) {
						form.reset()
						showErrorMessage(errorMessage)
					} else {
						initChunks(file, {
							dropFilename: info.dropFilename,
							hashAlgorithm: info.hashAlgorithm,
							chunkSize: info.sizes.chunk,
							maxConns: info.maxConns,
							maxRetries: info.maxRetries,
						})
					}
				} else {
					// Submit with hashdata.
					const errorMessage = checkFile(file, info.sizes.file)
					if (errorMessage) {
						form.reset()
						showErrorMessage(errorMessage)
					} else {
						submitWithHashdata(file, form)
					}
				}
			} else {
				// Submit before checking file.
				const errorMessage = checkFile(file, info.sizes.file)
				if (errorMessage) {
					alert(errorMessage)
				} else {
					form.submit(form)
				}
			}
		} else {
			// Submit only.
			form.submit(form)
		}
	}
}

/**
 * @param {object}   args
 * @param {string}   args.targetId
 * @param {string}   args.validationElementId
 * @param {boolean}  args.dropFilename
 * @param {string}   args.hashAlgorithm
 * @param {number}   args.maxRetries
 * @param {number}   args.maxConns
 * @param {object}   args.sizes
 * @param {number}   args.sizes.chunk
 * @param {number}   args.sizes.total
 * @param {number}   args.sizes.file
 * @param {string[]} args.supportedMimeType
 */
function hookUpload(args) {
	info = args
	validationElement = document.getElementById(info.validationElementId)
	document.getElementById(args.targetId).addEventListener('change', onFileChange)
}

window.hookUpload = hookUpload
