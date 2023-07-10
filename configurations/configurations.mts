import { Configuration } from '../shared/models/configurations/environment.mjs'
import { loadSync } from '../shared/utils/loader.mjs'

const environmentFilename = 'environment'

let cachedConfigurations: Configuration | null = null

export const loadConfigurations = () => {
	if (cachedConfigurations) {
		return cachedConfigurations
	}

	const conf = loadSync<Configuration>('configurations', environmentFilename)
	cachedConfigurations = conf
	return conf
}
