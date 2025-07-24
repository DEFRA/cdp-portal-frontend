import { defineConfig, configDefaults } from 'vitest/config'

export default defineConfig({
  test: {
    globals: true,
    environment: 'jsdom',
    clearMocks: true,
    snapshotFormat: {
      printBasicPrototype: false
    },
    snapshotSerializers: ['./test-helpers/snapshot-serializer.js'],
    setupFiles: [
      '.vite/setup-env.js',
      '.vite/setup-files.js',
      '.vite/custom-snapshot-matcher.js'
    ],
    coverage: {
      provider: 'v8',
      reportsDirectory: './coverage',
      reporter: ['text', 'clover'],
      include: ['src/**'],
      exclude: [
        ...configDefaults.exclude,
        '.public',
        'coverage',
        'postcss.config.js',
        'stylelint.config.js',
        'vitest.config.js'
      ]
    }
  }
})
