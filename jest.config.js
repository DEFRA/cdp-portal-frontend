/**
 * @type {Config}
 */
export default {
  rootDir: '.',
  testEnvironment: 'jsdom',
  verbose: true,
  resetModules: true,
  clearMocks: true,
  silent: false,
  testMatch: ['<rootDir>/src/**/*.test.js'],
  reporters: ['default', ['github-actions', { silent: false }], 'summary'],
  setupFilesAfterEnv: ['<rootDir>/.jest/setup.js'],
  collectCoverageFrom: ['<rootDir>/src/**/*.js'],
  coveragePathIgnorePatterns: [
    '<rootDir>/node_modules/',
    '<rootDir>/.server',
    '<rootDir>/.public',
    '<rootDir>/src/__fixtures__',
    '<rootDir>/test-helpers',
    'index.js'
  ],
  coverageDirectory: '<rootDir>/coverage',
  transform: {
    '^.+\\.js$': [
      'babel-jest',
      {
        plugins: ['babel-plugin-transform-import-meta']
      }
    ]
  },
  transformIgnorePatterns: []
}

/**
 * @import { Config } from 'jest'
 */
