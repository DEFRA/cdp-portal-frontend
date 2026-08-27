import { defineConfig } from 'vite'
import { NodePackageImporter } from 'sass-embedded'
import nunjucksPrecompile from './src/build/nunjucks-precompile-vite-plugin.js'
import { nodePolyfills } from 'vite-plugin-node-polyfills'

export default defineConfig({
  base: '/public',
  plugins: [
    nunjucksPrecompile({
      paths: [
        'node_modules/govuk-frontend/dist',
        'src/server/common/components',
        'src/server'
      ]
    }),
    nodePolyfills({
      include: ['path'],
      globals: {
        Buffer: false,
        global: false,
        process: true
      }
    })
  ],
  resolve: {
    alias: {
      path: 'path-browserify'
    }
  },
  build: {
    outDir: '.public',
    manifest: true,
    rolldownOptions: {
      input: {
        htmlAssets: 'src/client/assets.html',
        application: 'src/client/javascripts/application.js',
        applicationCss: 'src/client/stylesheets/application.scss',
        mermaid: 'src/client/javascripts/mermaid.js',
        webComponents: 'src/client/javascripts/web-components.js'
      },
      treeshake: false
    },
    sourcemap: true
  },
  css: {
    preprocessorOptions: {
      scss: {
        api: 'modern-compiler',
        importers: [new NodePackageImporter()],
        loadPaths: [
          'node_modules',
          'src/client/stylesheets',
          'src/server',
          'src/server/common/components',
          'src/server/common/templates/partials'
        ],
        quietDeps: true,
        sourceMapIncludeSources: true,
        style: 'expanded'
      }
    },
    lightningcss: { errorRecovery: true }
  },
  // Dev server
  server: {
    allowedHosts: true // Allow local CDP proxy hostnames (e.g. cdp.127.0.0.1.sslip.io) through the Vite dev server
  }
})
