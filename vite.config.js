import { defineConfig } from 'vite'
import { NodePackageImporter } from 'sass-embedded'
import nunjucks from 'nunjucks'

export default defineConfig({
  base: '/public',
  plugins: [
    {
      name: 'nunjucks-precompile',
      transform: {
        filter: {
          id: /\.(njk)$/
        },
        handler(src, id) {
          const compiled = nunjucks.precompileString(src, {
            name: id
          })

          return {
            code: `${compiled}
              export default '${id}';
            `,
            map: null
          }
        }
      }
    }
  ],
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
