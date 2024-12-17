import camelCase from 'lodash/camelCase.js'
import upperFirst from 'lodash/upperFirst.js'

import { nunjucksEnvironment } from '~/src/config/nunjucks/index.js'

function renderString(name, params, macroPath) {
  const macroName = `app${upperFirst(camelCase(name))}`
  const macroParams = JSON.stringify(params, null, 2)
  const macroString = `{%- from "${macroPath}" import ${macroName} -%} {{- ${macroName}(${macroParams}) -}}`

  return nunjucksEnvironment.renderString(macroString, {})
}

/**
 * Render component outside of .njk files
 * @param {string} name - component name
 * @param {object} params - component params
 * @returns {string}
 */
function renderComponent(name, params) {
  const macroPath = `${name}/macro.njk`

  return renderString(name, params, macroPath)
}

function renderIcon(name, params) {
  const macroPath = `icons/${name}/macro.njk`

  return renderString(name, params, macroPath)
}

export { renderIcon, renderComponent }
