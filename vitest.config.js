import { defineConfig, configDefaults, mergeConfig } from 'vitest/config'
import { playwright } from '@vitest/browser-playwright'
import viteConfig from './vite.config.js'

export default mergeConfig(viteConfig, defineConfig({
  test: {
    globals: true,
    clearMocks: true,
    snapshotFormat: {
      printBasicPrototype: false
    },
    projects: [
      {
        test: {
          name: 'server',
          include: ['src/**/*.test.js'],
          exclude: ['src/**/*.browser.test.js'],
          environment: 'jsdom',
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
      },
      {
        test: {
          name: 'browser',
          include: ['src/**/*.browser.test.js'],
          setupFiles: ['.vite/browser-setup-files.js'],
          browser: {
            enabled: true,
            headless: true,
            provider: playwright(),
            instances: [{ browser: 'chromium' }]
          }
        }
      }
    ]
  }
}))
