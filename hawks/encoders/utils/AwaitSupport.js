
/**
 * @param   {import('child_process').ChildProcessWithoutNullStreams} ffmpeg
 * @returns {Promise<any>}
 */
function getAwaiter(ffmpeg) {
	return new Promise((resolve, reject) => {
		let cacheProgress = null
		ffmpeg
			.once('progress', progress => cacheProgress = progress)
			.once('disconnect', () => reject())
			.once('error', err => reject(err))
			.once('close', code => {
				if (code !== 0) {
					reject(code)
				} else {
					resolve(cacheProgress)
				}
			})
	})
}

module.exports = getAwaiter
