module.exports = {
	moduleFileExtensions: ['js', 'jsx', 'mts'],
	moduleNameMapper: {
		'^(\\.{1,2}/.*)\\.mjs$': '$1',
	},
	roots: [
		'<rootDir>/clogs/',
		'<rootDir>/hawks/',
	],
	setupFilesAfterEnv: [
		'./utils/tests/setup-jest.js',
	],
	testMatch: [
		'**/*.test.?(c|m){j,t}s?(x)',
	],
	transform: {
		'^.+\\.jsx$': 'babel-jest',
		'^.+\\.mts$': ['ts-jest', { useESM: true }],
	},
}
