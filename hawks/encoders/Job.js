

class Job {
	constructor() {
	}

	exec() {
		throw Error('This function must be overridden.')
	}
}

module.exports = Job
