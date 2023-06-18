const { PrismaClient } = require('@prisma/client')
const validator = require('validator')

// Load environment constants.
const env = require('../../../constants/env')

/**
 * Create a user.
 * @param   {string}                                 screenname
 * @param   {string|null|undefined}                  name
 * @returns {Promise<import('@prisma/client').User>}
 */
module.exports = async (screenname, name) => {
	// Validate params.
	if (!validator.isLength(screenname, env.screennameLength)) {
		throw new Error('screenname')
	}
	if (name && !validator.isLength(name, env.nameLength)) {
		throw new Error('name')
	}

	// Add user to database.
	const prisma = new PrismaClient()
	const user = await prisma.user.create({
		data: {
			screenname,
			name,
		},
	})

	return user
}
