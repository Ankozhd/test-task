const path = require('path')

module.exports = {
	rootDir: path.resolve(__dirname),
	preset: 'ts-jest',
	testEnvironment: '<rootDir>/test/setup/jest-node-env-with-globalthis.js',
	transform: {
		'^.+\\.(t|j)s$': [
			'ts-jest',
			{
				diagnostics: false,
			},
		],
	},
	transformIgnorePatterns: ['<rootDir>/node_modules/'],
	moduleNameMapper: {
		uuid: require.resolve('uuid'),
	},
	globalSetup: '<rootDir>/test/setup/setup.ts',
	testTimeout: 100000,
}
