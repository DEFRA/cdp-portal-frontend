import { defineConfig } from 'vite'
import { NodePackageImporter } from 'sass-embedded'
import path from 'node:path'

const govukFrontendPath = path.dirname(
  require.resolve('govuk-frontend/package.json')
)

export default defineConfig({
  base: '/public',
  resolve: {
    alias: [
      {
        find: '/public/assets',
        replacement: path.join(govukFrontendPath, 'dist/govuk/assets')
      }
    ]
  },
  build: {
    outDir: '.public',
    manifest: true,
    rolldownOptions: {
      input: {
        htmlAssets: 'src/client/assets.html',
        application: 'src/client/javascripts/application.js',
        applicationCss: 'src/client/stylesheets/application.scss',
        mermaid: 'src/client/javascripts/mermaid.js'
      }
    },
    cssMinify: false
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
  server: {}
})
