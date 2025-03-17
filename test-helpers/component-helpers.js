import path from 'node:path'
import { fileURLToPath } from 'node:url'
import nunjucks from 'nunjucks'
import { load } from 'cheerio'
import { camelCase, upperFirst } from 'lodash'

import * as filters from '~/src/config/nunjucks/filters/filters.js'
import { testGlobals } from '~/test-helpers/test-globals.js'

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

function renderTestComponent(name, params, callBlock) {
  const macroPath = `${name}/macro.njk`
  const macroName = `app${upperFirst(camelCase(name.replace('icons', '')))}`
  const macroParams = JSON.stringify(params, null, 2)
  let macroString = `{%- from "${macroPath}" import ${macroName} -%}`

  if (callBlock) {
    macroString += `{%- call ${macroName}(${macroParams}) -%}${callBlock}{%- endcall -%}`
  } else {
    macroString += `{{- ${macroName}(${macroParams}) -}}`
  }

  return load(nunjucksTestEnv.renderString(macroString))
}

function renderPage(viewPath, context) {
  return nunjucksTestEnv.render(`${viewPath}.njk`, context)
}

export { renderTestComponent, renderPage }
