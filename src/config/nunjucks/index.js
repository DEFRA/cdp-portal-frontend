import path from 'node:path'
import yar from '@hapi/yar'
import nunjucks from 'nunjucks'
import Vision from '@hapi/vision'

import { config } from '../config.js'
import { context } from './context/context.js'
import * as filters from './filters/filters.js'
import * as globals from './globals/globals.js'
import * as extensions from './extensions/extensions.js'

const dirname = import.meta.dirname
const { watch, doCache } = config.get('templateGeneration')

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
    watch,
    noCache: !doCache
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
          const template = nunjucks.compile(
            src,
            options.environment,
            options.filename
          )
          return (context) => template.render(context)
        }
      }
    },
    compileOptions: {
      environment: nunjucksEnvironment
    },
    relativeTo: path.normalize(path.resolve(dirname, '..', '..')),
    path: 'server',
    isCached: doCache,
    context
  }
}

for (const filter of Object.keys(filters)) {
  nunjucksEnvironment.addFilter(filter, filters[filter])
}

for (const global of Object.keys(globals)) {
  nunjucksEnvironment.addGlobal(global, globals[global])
}

for (const extension of Object.keys(extensions)) {
  nunjucksEnvironment.addExtension(extension, new extensions[extension]())
}

export { nunjucksConfig, nunjucksEnvironment }
