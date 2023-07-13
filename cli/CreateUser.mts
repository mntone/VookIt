import { ParseArgsConfig, parseArgs } from 'util'

import { CreateUserUseCase } from '../clogs/usecase/users/create.mjs'
import { PrismaService } from '../clogs/usecase/utils/prisma.service.mjs'

const main = async () => {
	const config: ParseArgsConfig = {
		args: process.argv.slice(2),
		options: {
			screenname: {
				type: 'string',
				short: 'n',
				default: 'dev',
			},
			password: {
				type: 'string',
				short: 'p',
				default: 'testing123',
			},
		},
		allowPositionals: true,
	}
	const { values: props, positionals } = parseArgs(config)

	const screenname = positionals[0] || props.screenname as string
	const password = positionals[1] || props.password as string

	const prisma = new PrismaService()
	const user = await new CreateUserUseCase(prisma).create(screenname, password)
	return user
}

if (require.main === module) {
	main().then(user => {
		console.log(user)
	})
} else {
	module.exports = main
}
