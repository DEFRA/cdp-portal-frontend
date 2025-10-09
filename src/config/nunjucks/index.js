import path from 'node:path'
import { fileURLToPath } from 'node:url'
import yar from '@hapi/yar'
import nunjucks from 'nunjucks'
import Vision from '@hapi/vision'

import { config } from '../config.js'
import { context } from './context/context.js'
import * as filters from './filters/filters.js'
import * as globals from './globals/globals.js'
import * as extensions from './extensions/extensions.js'

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

Object.keys(extensions).forEach((extension) => {
  nunjucksEnvironment.addExtension(extension, new extensions[extension]())
})

export { nunjucksConfig, nunjucksEnvironment }
