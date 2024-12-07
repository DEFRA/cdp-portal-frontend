import path from 'node:path'
import { fileURLToPath } from 'node:url'
import yar from '@hapi/yar'
import nunjucks from 'nunjucks'
import Vision from '@hapi/vision'

import { config } from '~/src/config/index.js'
import { context } from '~/src/config/nunjucks/context/index.js'
import * as filters from '~/src/config/nunjucks/filters/index.js'
import * as globals from '~/src/config/nunjucks/globals/index.js'

const dirname = path.dirname(fileURLToPath(import.meta.url))

const paths = {
  templates: path.normalize(
    path.resolve(dirname, '..', '..', 'server', 'common', 'templates')
  ),
  components: path.normalize(
    path.resolve(dirname, '..', '..', 'server', 'common', 'components')
  ),
  server: path.normalize(path.resolve(dirname, '..', '..', 'server'))
}

const nunjucksEnvironment = nunjucks.configure(
  [
    'node_modules/govuk-frontend/dist/',
    paths.templates,
    paths.components,
    paths.server
  ],
  {
    autoescape: true,
    throwOnUndefined: false,
    trimBlocks: true,
    lstripBlocks: true,
    watch: config.get('nunjucks.watch'),
    noCache: config.get('nunjucks.noCache')
  }
)

const nunjucksConfig = {
  plugin: {
    ...Vision,
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
    relativeTo: path.normalize(path.resolve(dirname, '..', '..')),
    path: 'server',
    isCached: config.get('isProduction'),
    context
  }
}

Object.keys(filters).forEach((filter) => {
  nunjucksEnvironment.addFilter(filter, filters[filter])
})

Object.keys(globals).forEach((global) => {
  nunjucksEnvironment.addGlobal(global, globals[global])
})

export { nunjucksConfig, nunjucksEnvironment }
