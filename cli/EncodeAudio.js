const { parseArgs } = require('util')

const FFmpegEncode = require('../hawks/encoders/FFmpegEncode')
const FFmpegAudioOptions = require('../hawks/encoders/options/ffmpeg-audio')
const Mp3LameOptions = require('../hawks/encoders/options/mp3lame')

function main() {
	const options = {
		codec: {
			type: 'string',
			short: 'c',
			default: 'aac_at',
		},
		input: {
			type: 'string',
			short: 'i',
		},
		output: {
			type: 'string',
		},
		abr: {
			type: 'boolean',
			default: false,
		},
	}
	const args = process.argv.slice(2)
	const { values: props, positionals } = parseArgs({ args, options, allowPositionals: true })

	const codec = FFmpegAudioOptions.parseCodec(props.codec)
	const input = props.input
	const output = positionals[0] || props.output

	let task
	if (codec === FFmpegAudioOptions.Codec.MP3_LAME) {
		const lameOptions = new Mp3LameOptions()
		lameOptions.abr = props.abr
		task = new FFmpegEncode(lameOptions).exec(input, output)
	} else {
		const audioOptions = new FFmpegAudioOptions(codec)
		task = new FFmpegEncode(audioOptions).exec(input, output)
	}
	task.stderr.on('data', data => {
		console.log(data.toString())
	})
}

if (require.main === module) {
	main()
} else {
	module.exports = main
}
