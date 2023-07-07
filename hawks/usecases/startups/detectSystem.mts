import { getSoftwareVersion } from '../../../clogs/utils/VersionSupport.js'
import { VideoFilter } from '../filters/video.mjs'
import { ffmpeg } from '../trampolines/ffmpeg.mjs'

export function detectSystem() {
	console.log('# --------------------------------------------------')
	console.log(`# VookIt! Version ${getSoftwareVersion()} - Hawks (backend)`)
	console.log('# --------------------------------------------------')

	// Check ffmpeg version.
	const ffmpegVersion = ffmpeg.version
	if (ffmpegVersion.includes('command not found')) {
		console.log('# ffmpeg is not installed')
		throw new Error('ffmpeg is not installed')
	}

	// [Note] HDR support after ffmpeg v6
	const ffmpegMajor = Number(ffmpegVersion.split('.', 2)[0])
	console.log(`# Detect ffmpeg: version ${ffmpegVersion}`)
	const ffmpegHdrSupport = ffmpegMajor >= 6

	// [Note] Use Zimg (z.lib) when hdr color conversion
	const isZimgLinked = ffmpeg.filters.some(f => f.name === 'zscale')
	VideoFilter.useZImg = isZimgLinked
	console.log(`# Detect libzimg: ${isZimgLinked ? 'yes' : 'no'}`)

	const hdrAvailable = ffmpegHdrSupport && isZimgLinked
	console.log(`# Detect HDR support: ${hdrAvailable ? 'yes' : 'no'}`)
}
