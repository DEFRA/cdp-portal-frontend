import { defineConfig } from 'vite'

export default defineConfig({
  build: {
    outDir: '.public',
    manifest: true,
    rolldownOptions: {
      input: [
        'src/client/javascripts/application.js',
        'src/client/javascripts/mermaid.js',
        'src/client/stylesheets/application.scss'
      ]
    },
    cssMinify: false
  },
  css: {
    preprocessorOptions: {
      scss: {
        loadPaths: [
          'src/client/stylesheets',
          'src/server',
          'src/server/common/components',
          'src/server/common/templates/partials',
          'node_modules'
        ],
        quietDeps: true,
        sourceMapIncludeSources: true,
        style: 'expanded'
      }
    }
  },
  // Dev server
  server: {}
})
