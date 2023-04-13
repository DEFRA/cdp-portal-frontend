import path from 'path'
import nunjucks from 'nunjucks'
import hapiVision from '@hapi/vision'

import { config } from '~/src/config'
import { globalContext } from './global-context'

const nunjucksConfig = {
  plugin: hapiVision,
  options: {
    engines: {
      njk: {
        compile: (src, options) => {
          const template = nunjucks.compile(src, options.environment)
          return (context) => template.render(context)
        }
      }
    },
    compileOptions: {
      environment: nunjucks.configure(
        [
          'node_modules/govuk-frontend/',
          path.resolve(__dirname, '..', '..', 'common', 'templates')
        ],
        {
          autoescape: true,
          throwOnUndefined: false,
          trimBlocks: true,
          lstripBlocks: true,
          watch: config.get('isDevelopment'),
          noCache: config.get('isDevelopment')
        }
      )
    },
    relativeTo: path.normalize(path.resolve(__dirname, '..', '..')),
    path: 'app',
    isCached: config.get('isProduction'),
    context: globalContext
  }
}

export { nunjucksConfig }
