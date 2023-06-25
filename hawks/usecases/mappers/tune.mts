import { TuneConfig } from '../../models/configs/TuneConfig.mjs'
import { Tune } from '../../models/encoders/Tune.mjs'

export function mapTune(config: TuneConfig, base: TuneConfig) {
	const ret: Tune = {
		increaseBitrateMultiplier: config?.increase || base?.increase || 1,
		decreaseBitrateMultiplier: config?.decrease || base?.decrease || 1,
	}
	return Object.freeze(ret)
}
