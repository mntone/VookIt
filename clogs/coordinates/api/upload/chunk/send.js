const createError = require('http-errors')
const { Form } = require('multiparty')
const validator = require('validator')

const env = require('../../../../../constants/env')
const { addSIPrefix } = require('../../../../../utils/DataSizeSupport')
const scheme = require('../../../../schemas/api/upload/chunk/send')
const InternalError = require('../../../../usecase/InternalError')
const sendChunk = require('../../../../usecase/uploads/chunks/send')
const { cachecontrol } = require('../../../../utils/express/cachecontrol')
const isCUID = require('../../../../utils/isCUID')
const ResponseBuilder = require('../../../utils/ResponseBuilder')

/**
 * Define multiparty options.
 * @constant
 * @type {import('multiparty').FormOptions}
 */
const multipartyOptions = Object.freeze({
	maxFieldsSize: 0,
	maxFilesSize: env.uploadMaxFileSize,
})

class SendChunkUploadResponseBuilder extends ResponseBuilder {
	/**
	 * @param {import('express').Request}      req
	 * @param {import('express').Response}     res
	 * @param {import('express').NextFunction} next
	 */
	async _onNext(req, res, next) {
		const form = new Form(multipartyOptions)
		form.parse(req, async (err, fields, files) => {
			if (err) {
				if (err.message === 'maximum file length exceeded') {
					const friendly = addSIPrefix(env.uploadMaxChunkSize)
					const newErr = createError(413, `The file exceeds the maximum size of ${friendly}Bytes.`)
					next(newErr)
				} else {
					const newErr = createError(400, err.message)
					next(newErr)
				}
				return
			}

			if (!fields.cuid || fields.cuid.length !== 1 || !isCUID(fields.cuid[0])) {
				throw new InternalError('cuid', 400)
			}

			if (!fields.index || fields.index.length !== 1 || !validator.isInt(fields.index[0], { min: 0 })) {
				throw new InternalError('index', 400)
			}

			if (!fields.hash || fields.hash.length !== 1) {
				throw new InternalError('upload.nohash', 400)
			}

			const filesInFile = files['chunked_file']
			if (!filesInFile || filesInFile.length !== 1) {
				throw new InternalError('upload.nofile', 400)
			}

			const cuid = fields.cuid[0]
			const index = Number(fields.index[0])
			const hashdata = fields.hash[0]
			const file = filesInFile[0]
			await sendChunk(cuid, index, hashdata, file)
			res.sendStatus(200)
		})
	}

	get _scheme() {
		return scheme
	}

	get handlers() {
		const baseHandlers = super.handlers
		baseHandlers.splice(-1, 0, cachecontrol({
			private: true,
			noStore: true,
		}))
		return baseHandlers
	}
}

module.exports = new SendChunkUploadResponseBuilder()
