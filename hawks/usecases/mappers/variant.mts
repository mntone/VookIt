// @ts-ignore
import { removeSIPrefixIfNeeded } from '../../../utils/DataSizeSupport.js'
import { CodecConfig } from '../../models/configs/CodecConfig.mjs'
import { VariantConfig } from '../../models/configs/VariantConfig.mjs'
import { Variant } from '../../models/encoders/Variant.mjs'

import { mapTune } from './tune.mjs'

export function mapVariant(config: VariantConfig, base: CodecConfig) {
	const ret: Variant = {
		type: base.type,
		id: config.id,
		friendlyId: config.idstr,
		friendlyCodecId: base.idstr,
		enabled: config.enabled ?? base.enabled ?? true,
		public: base.public ?? false,
		queueName: config.runsOn,
		filename: config.filename,
		fileExtension: base.ext,
		mimeType: base.mime,
		audioCodecIds: Array.isArray(base.audios) ? base.audios : [base.audios],
		useHls: base.useHls ?? false,
		bitrate: removeSIPrefixIfNeeded(config.bitrate),
		encodeOptions: { ...base.options, ...config.options },
		tune: mapTune(config.tune, base.tune),
	}
	return Object.freeze(ret)
}
