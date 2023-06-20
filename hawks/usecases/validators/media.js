const { existsSync } = require('fs')

const { execAsJson: execFFprobeAsJson } = require('../../encoders/FFprobe')
const { loadYamlSync } = require('../../utils/yaml-loader')
const audioAccesors = require('../accessors/audio')
const containerAccesors = require('../accessors/container')
const videoAccesors = require('../accessors/video')

const rules = loadYamlSync(__dirname, '../../configs/validator')
const containerRules = rules.flows[rules.use.container]
const audioRules = rules.flows[rules.use.audio]
const videoRules = rules.flows[rules.use.video]

/**
 * Validate media.
 * @param {object} info
 * @param {object} rules
 * @param {object} accessors
 */
function validate(info, rules, accessors) {
	for (const rule of rules) {
		const key = rule.left
		if (!Object.prototype.hasOwnProperty.call(accessors, key)) {
			throw Error('hawks.error.noaccessor')
		}

		const { accessor, type: propType } = accessors[key]
		switch (propType) {
		case 'string':
			switch (rule.operator) {
			case '==':
			case '===':
				if (accessor(info) !== rule.right) {
					throw Error(rule.message)
				}
				break
			case '!=':
			case '!==':
				if (accessor(info) === rule.right) {
					throw Error(rule.message)
				}
				break
			case 'includes':
				if (!rule.right.includes(accessor(info))) {
					throw Error(rule.message)
				}
				break
			case 'excludes': {
				const right = accessor(info)
				if (rule.right.some(r => r === right)) {
					throw Error(rule.message)
				}
				break
			}
			default:
				throw Error('hawks.error.invalid_operator')
			}
			break
		case 'number':
			switch (rule.operator) {
			case '==':
			case '===':
				if (accessor(info) !== rule.right) {
					throw Error(rule.message)
				}
				break
			case '!=':
			case '!==':
				if (accessor(info) === rule.right) {
					throw Error(rule.message)
				}
				break
			case '<':
				if (accessor(info) >= rule.right) {
					throw Error(rule.message)
				}
				break
			case '<=':
				if (accessor(info) > rule.right) {
					throw Error(rule.message)
				}
				break
			case '>':
				if (accessor(info) <= rule.right) {
					throw Error(rule.message)
				}
				break
			case '>=':
				if (accessor(info) < rule.right) {
					throw Error(rule.message)
				}
				break
			default:
				throw Error('hawks.error.invalid_operator')
			}
			break
		default:
			throw Error('hawks.error.invalid_proptype')
		}
	}
}

/**
 * @param   {string}          filename
 * @returns {Promise<object>}
 */
module.exports = async filename => {
	if (!existsSync(filename)) {
		throw Error('hawks.error.notfound')
	}

	const info = await execFFprobeAsJson({
		input: filename,
		showFormat: true,
		showStreams: true,
	})

	// Validate container
	validate(info.format, containerRules, containerAccesors)

	// Validate audio
	let hasAudio = false
	const audio = info.streams.findIndex(stream => stream.codec_type === 'audio')
	if (audio !== -1) {
		hasAudio = true
		validate(info.streams[audio], audioRules, audioAccesors)
	}

	// Validate video
	let hasVideo = false
	const video = info.streams.findIndex(stream => stream.codec_type === 'video')
	if (video !== -1) {
		hasVideo = true
		validate(info.streams[video], videoRules, videoAccesors)
	}

	if (!hasAudio && !hasVideo) {
		throw Error('hawks.error.novalidstream')
	}

	return info
}
