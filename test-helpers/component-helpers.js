import path from 'path'
import nunjucks from 'nunjucks'
import { load } from 'cheerio'
import { camelCase } from 'lodash'

import * as filters from '~/src/config/nunjucks/filters'

const nunjucksTestEnv = nunjucks.configure(
  [
    'node_modules/govuk-frontend/dist/',
    'server',
    path.normalize(
      path.resolve(__dirname, '..', 'src', 'server', 'common', 'templates')
    ),
    path.normalize(
      path.resolve(__dirname, '..', 'src', 'server', 'common', 'components')
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

function renderTestComponent(name, params, callBlock) {
  const macroPath = `${name}/macro.njk`
  const macroName = `app${
    name.charAt(0).toUpperCase() + camelCase(name.slice(1))
  }`
  const macroParams = JSON.stringify(params, null, 2)
  let macroString = `{%- from "${macroPath}" import ${macroName} -%}`

  if (callBlock) {
    macroString += `{%- call ${macroName}(${macroParams}) -%}${callBlock}{%- endcall -%}`
  } else {
    macroString += `{{- ${macroName}(${macroParams}) -}}`
  }

  return load(nunjucksTestEnv.renderString(macroString))
}

export { renderTestComponent }
