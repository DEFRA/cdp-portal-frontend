module.exports = {
  rootDir: '.',
  testEnvironment: 'jsdom',
  verbose: true,
  resetModules: true,
  clearMocks: true,
  silent: process.env.NODE_ENV !== 'development',
  testMatch: ['<rootDir>/src/**/*.test.js'],
  reporters: ['default', ['github-actions', { silent: false }], 'summary'],
  setupFiles: ['<rootDir>/.jest/setup-envs.js'],
  setupFilesAfterEnv: ['<rootDir>/.jest/setup.js'],
  collectCoverageFrom: ['<rootDir>/src/**/*.js'],
  coveragePathIgnorePatterns: [
    '<rootDir>/node_modules/',
    '<rootDir>/.server',
    '<rootDir>/.public',
    '<rootDir>/src/__fixtures__',
    '<rootDir>/test-helpers',
    '<rootDir>/mock-api',
    'index.js'
  ],
  coverageDirectory: '<rootDir>/coverage'
}
