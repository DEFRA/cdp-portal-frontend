import path from 'path'
import nunjucks from 'nunjucks'
import hapiVision from '@hapi/vision'

import { config } from '~/src/config'
import { context } from './context'
import * as filters from './filters'

const nunjucksEnvironment = nunjucks.configure(
  [
    'node_modules/govuk-frontend/',
    path.resolve(__dirname, '..', '..', 'common', 'templates'), // TODO add to config?
    path.resolve(__dirname, '..', '..', 'common', 'components')
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
      environment: nunjucksEnvironment
    },
    relativeTo: path.normalize(path.resolve(__dirname, '..', '..')),
    path: 'app',
    isCached: config.get('isProduction'),
    context
  }
}

Object.keys(filters).forEach((filter) => {
  nunjucksEnvironment.addFilter(filter, filters[filter])
})

export { nunjucksConfig }
