import path from 'path'
import yar from '@hapi/yar'
import nunjucks from 'nunjucks'
import hapiVision from '@hapi/vision'

import { config } from '~/src/config'
import { context } from '~/src/config/nunjucks/context'
import * as filters from '~/src/config/nunjucks/filters'
import * as globals from '~/src/config/nunjucks/globals'

const nunjucksEnvironment = nunjucks.configure(
  [
    'node_modules/govuk-frontend/',
    path.normalize(
      path.resolve(__dirname, '..', '..', 'server', 'common', 'templates')
    ),
    path.normalize(
      path.resolve(__dirname, '..', '..', 'server', 'common', 'components')
    )
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
  plugin: {
    ...hapiVision,
    dependency: yar
  },
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
    path: 'server',
    isCached: config.get('isProduction'),
    context
  }
}

Object.keys(globals).forEach((global) => {
  nunjucksEnvironment.addGlobal(global, globals[global])
})

Object.keys(filters).forEach((filter) => {
  nunjucksEnvironment.addFilter(filter, filters[filter])
})

export { nunjucksConfig }
