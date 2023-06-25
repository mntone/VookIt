import { CodecConfig } from '../../models/configs/CodecConfig.mjs'
import { Codec } from '../../models/encoders/Codec.mjs'
import { MapperOptions } from '../../models/mappers/MapperOptions.mjs'

import { mapVariant } from './variant.mjs'

export function mapCodec(config: CodecConfig, options?: MapperOptions) {
	const ret: Codec = {
		type: config.type,
		id: config.id,
		friendlyId: config.idstr,
		enabled: config.enabled ?? true,
		public: config.public ?? false,
		queueName: config.runsOn || options?.queueName || 'encode',
		variants: config.variants.filter(v => v.enabled !== false).map(v => mapVariant(v, config)),
	}
	return Object.freeze(ret)
}
