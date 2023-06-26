module.exports = {
	moduleFileExtensions: ['js', 'mjs', 'cts', 'mts'],
	moduleNameMapper: {
		'^(\\.{1,2}/.*)\\.mjs$': '$1',
	},
	setupFilesAfterEnv: [
		'./utils/tests/setup-jest.js',
	],
	testMatch: [
		'**/__tests__/**/*.+(js|mjs|cts|mts)',
		'**/?(*.)+(spec|test).+(js|mjs|cts|mts)',
	],
	transform: {
		'^.+\\.(ts|cts)$': 'ts-jest',
		'^.+\\.mts$': ['ts-jest', { useESM: true }],
	},
}
