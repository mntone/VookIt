const fs = require('fs')
const path = require('path')

const env = require('../../../constants/env')
const prisma = require('../prisma')

/**
 * Create upload from temporary file.
 * @param                                              tempfile
 * @returns {Promise<import('@prisma/client').Upload>}
 */
module.exports = async tempfile => {
	const ext = path.extname(tempfile.originalFilename)

	let savedFilename
	if (env.uploadDeleteOriginalFilename) {
		savedFilename = 'video' + ext
	} else {
		savedFilename = tempfile.originalFilename
	}

	// Add upload to database.
	const upload = await prisma.upload.create({
		data: {
			filename: savedFilename,
			endedBy: new Date(),
		},
	})

	// Move files from temporary.
	const filename = upload.uuid + ext
	const filepath = path.join(env.uploadWorkdir, filename)
	fs.rename(tempfile.path, filepath, err => {
		// [TODO] log & delete upload from database
		if (err) {
			console.log(err)
		}
	})

	return upload
}
