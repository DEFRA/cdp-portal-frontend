import path from 'path'
import yar from '@hapi/yar'
import nunjucks from 'nunjucks'
import hapiVision from '@hapi/vision'
import nunjucksMarkdown from 'nunjucks-markdown'
import markdownParser from 'markdown-it'

import { config } from '~/src/config'
import { context } from '~/src/config/nunjucks/context'
import * as filters from '~/src/config/nunjucks/filters'
import * as globals from '~/src/config/nunjucks/globals'

const paths = {
  templates: path.normalize(
    path.resolve(__dirname, '..', '..', 'server', 'common', 'templates')
  ),
  components: path.normalize(
    path.resolve(__dirname, '..', '..', 'server', 'common', 'components')
  ),
  server: path.normalize(path.resolve(__dirname, '..', '..', 'server'))
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

Object.keys(filters).forEach((filter) => {
  nunjucksEnvironment.addFilter(filter, filters[filter])
})

Object.keys(globals).forEach((global) => {
  nunjucksEnvironment.addGlobal(global, globals[global])
})

nunjucksMarkdown.register(nunjucksEnvironment, (body) => {
  // TODO lots of config https://markdown-it.github.io/markdown-it/
  return markdownParser({
    // TODO do we need to support HTML?
    html: false, // Be careful with this option, it can lead to XSS.
    typographer: true,
    breaks: true,
    linkify: true
  }).render(body)
})

export { nunjucksConfig, nunjucksEnvironment }
