import {
	CanActivate,
	ExecutionContext,
	Injectable,
	UnauthorizedException,
} from '@nestjs/common'
import fastify from 'fastify'

@Injectable()
export class AuthenticationsGuard implements CanActivate {
	async canActivate(context: ExecutionContext) {
		const request = context.switchToHttp().getRequest<fastify.FastifyRequest>()
		const userId = request.session.uid
		if (!userId) {
			throw new UnauthorizedException()
		}
		return true
	}
}
