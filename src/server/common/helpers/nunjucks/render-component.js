import camelCase from 'lodash/camelCase.js'
import upperFirst from 'lodash/upperFirst.js'

import { nunjucksEnvironment } from '~/src/config/nunjucks/index.js'

/**
 * Render component outside of .njk files
 * @param {string} name - component name
 * @param {object} params - component params
 * @returns {*}
 */
function renderComponent(name, params) {
  const macroPath = `${name}/macro.njk`
  const macroName = `app${upperFirst(camelCase(name))}`
  const macroParams = JSON.stringify(params, null, 2)
  const macroString = `{%- from "${macroPath}" import ${macroName} -%}{{- ${macroName}(${macroParams}) -}}`

  return nunjucksEnvironment.renderString(macroString, {})
}

export { renderComponent }
