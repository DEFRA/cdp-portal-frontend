import { defineConfig, configDefaults } from 'vitest/config'

export default defineConfig({
  test: {
    environment: 'jsdom',
    globals: true,
    clearMocks: true,
    snapshotFormat: {
      printBasicPrototype: false
    },
    snapshotSerializers: ['./test-helpers/snapshot-serializer.js'],
    setupFiles: [
      '.vite/setup-env.js',
      '.vite/setup-files.js',
      'test-helpers/to-match-file.js'
    ],
    coverage: {
      provider: 'v8',
      reportsDirectory: './coverage',
      reporter: ['text', 'lcov'],
      include: ['src/**/*.js'],
      exclude: [
        ...configDefaults.exclude,
        'src/__fixtures__/**',
        '.public',
        'coverage',
        'postcss.config.js',
        'stylelint.config.js',
        'vitest.config.js',
        '.sonarlint'
      ]
    }
  }
})
