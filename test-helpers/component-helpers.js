import path from 'node:path'
import { fileURLToPath } from 'node:url'
import nunjucks from 'nunjucks'
import * as cheerio from 'cheerio'

import { camelCase, upperFirst } from 'lodash'

import * as filters from '../src/config/nunjucks/filters/filters.js'
import { testGlobals } from './test-globals.js'

const dirname = path.dirname(fileURLToPath(import.meta.url))
const nunjucksTestEnv = nunjucks.configure(
  [
    'node_modules/govuk-frontend/dist/',
    path.normalize(path.resolve(dirname, '..', 'src', 'server')),
    path.normalize(
      path.resolve(dirname, '..', 'src', 'server', 'common', 'templates')
    ),
    path.normalize(
      path.resolve(dirname, '..', 'src', 'server', 'common', 'components')
    )
  ],
  {
    trimBlocks: true,
    lstripBlocks: true,
    watch: false
  }
)

Object.keys(filters).forEach((filter) => {
  nunjucksTestEnv.addFilter(filter, filters[filter])
})

Object.keys(testGlobals).forEach((global) => {
  nunjucksTestEnv.addGlobal(global, testGlobals[global])
})

function renderTestComponent(name, options = {}) {
  const params = options?.params ?? {}
  const callBlock = options?.callBlock ?? []
  const context = options?.context ?? {}

  const macroPath = `${name}/macro.njk`
  const macroName = `app${upperFirst(camelCase(name.replace('icons', '')))}`
  const macroParams = JSON.stringify(params, null, 2)
  let macroString = `{%- from "${macroPath}" import ${macroName} with context -%}`

  if (Array.isArray(callBlock) && callBlock.length > 0) {
    macroString += `{%- call ${macroName}(${macroParams}) -%}${callBlock.join(' ')}{%- endcall -%}`
  } else {
    macroString += `{{- ${macroName}(${macroParams}) -}}`
  }

  return cheerio.load(nunjucksTestEnv.renderString(macroString, context))
}

function renderPage(viewPath, context) {
  return nunjucksTestEnv.render(`${viewPath}.njk`, context)
}

export { renderTestComponent, renderPage }
