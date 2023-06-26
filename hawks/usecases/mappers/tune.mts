import { TuneConfig } from '../../models/configs/TuneConfig.mjs'
import { Tune } from '../../models/encoders/Tune.mjs'
import { MapperOptions } from '../../models/mappers/MapperOptions.mjs'

export function mapTune(config: TuneConfig, base: TuneConfig, options?: MapperOptions) {
	const ret: Tune = {
		bitsPerPixel: config?.bpp || config?.bpp || options?.defaultBitsPerPixel || 0.11,
		increaseBitrateMultiplier: config?.increase || base?.increase || 1,
		decreaseBitrateMultiplier: config?.decrease || base?.decrease || 1,
	}
	return Object.freeze(ret)
}
