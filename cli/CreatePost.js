const { parseArgs } = require('util')

const { PrismaClient } = require('@prisma/client')

async function main() {
	const options = {
		title: {
			type: 'string',
			short: 't',
			default: '(unknown)',
		},
		description: {
			type: 'string',
			short: 'd',
			default: '(description)',
		},
		screenname: {
			type: 'string',
			short: 'n',
			default: 'dev',
		},
	}
	const args = process.argv.slice(2)
	const { values: props, positionals } = parseArgs({ args, options, allowPositionals: true })

	const title = positionals[0] || props.title
	const description = props.description
	const screenname = props.screenname

	// Add post to database.
	const prisma = new PrismaClient()
	const post = await prisma.post.create({
		data: {
			title,
			description,
			filename: 'video.mp4',
			author: {
				connect: { screenname: screenname },
			},
		},
	})
	return post
}

if (require.main === module) {
	main().then(post => console.log(post))
} else {
	module.exports = main
}
