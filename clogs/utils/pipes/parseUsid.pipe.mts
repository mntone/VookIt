import { HttpStatus, Injectable, Optional, PipeTransform } from '@nestjs/common'
import { ErrorHttpStatusCode, HttpErrorByCode } from '@nestjs/common/utils/http-error-by-code.util.js'
import validator from 'validator'

import { toIdAsNumber } from '../IdSupport.js'

export type ParseUsidPipeOptions = {
	errorHttpStatusCode?: ErrorHttpStatusCode
	exceptionFactory?: (error: string) => unknown
	optional?: boolean
}

@Injectable()
export class ParseUsidPipe implements PipeTransform<string> {
	protected _exceptionFactory: (error: string) => unknown

	constructor(@Optional() protected readonly options: ParseUsidPipeOptions = {}) {
		const statusCode = options.errorHttpStatusCode || HttpStatus.BAD_REQUEST
		this._exceptionFactory = options.exceptionFactory
			|| (err => new HttpErrorByCode[statusCode](err))
	}

	async transform(value?: string): Promise<number | undefined> {
		if (value == null) {
			if (this.options.optional) {
				return value
			} else {
				throw this._exceptionFactory(
					'Validation failed (url-safed base64 string is expected)',
				)
			}
		}

		if (!validator.default.isBase64(value, { urlSafe: true })) {
			throw this._exceptionFactory(
				'Validation failed (url-safed base64 string is expected)',
			)
		}

		const id = toIdAsNumber(value)
		if (id <= 0) {
			throw this._exceptionFactory(
				'Validation failed (non-zero is expected)',
			)
		}

		return id
	}
}
