import {
	BadRequestException,
	CallHandler,
	ExecutionContext,
	NestInterceptor,
	Type,
	mixin,
} from '@nestjs/common'
import { BusboyConfig } from 'busboy'
import fastify from 'fastify'
import { Observable } from 'rxjs'

export class FileData {
	readonly filename!: string
	readonly mimetype!: string
	readonly buffer!: Buffer
}

export function FileInterceptor(fieldName: string, options?: Omit<BusboyConfig, 'headers'>): Type<NestInterceptor> {
	class MixinInterceptor implements NestInterceptor {
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		async intercept(context: ExecutionContext, next: CallHandler): Promise<Observable<any>> {
			const req = context.switchToHttp().getRequest<fastify.FastifyRequest>()
			if (!req.isMultipart()) {
				throw new BadRequestException('multipart/form-data expected.')
			}

			const parts = req.parts(options)
			// eslint-disable-next-line @typescript-eslint/no-explicit-any
			const body: any = { }
			for await (const part of parts) {
				if (part.type === 'file') {
					if (part.fieldname === fieldName) {
						body[part.fieldname] = {
							filename: part.filename,
							mimetype: part.mimetype,
							buffer: await part.toBuffer(),
						}
					}
				} else {
					if (part.fieldname !== '__proto__' && part.fieldname !== 'constructor') {
						body[part.fieldname] = part.value
					}
				}
			}
			req.body = body
			return next.handle()
		}
	}

	const Interceptor = mixin(MixinInterceptor)
	return Interceptor
}
