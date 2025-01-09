import camelCase from 'lodash/camelCase.js'
import upperFirst from 'lodash/upperFirst.js'

import { nunjucksEnvironment } from '~/src/config/nunjucks/index.js'

function renderString(name, params, macroPath, caller = []) {
  const macroName = `app${upperFirst(camelCase(name))}`
  const macroParams = JSON.stringify(params, null, 2)
  let macroString = `{%- from "${macroPath}" import ${macroName} -%}`

  if (caller.length) {
    macroString += `{% call ${macroName}(${macroParams}) %} ${caller.join(' ')} {% endcall %}`
  } else {
    macroString += `{{- ${macroName}(${macroParams}) -}}`
  }

  return nunjucksEnvironment.renderString(macroString, {})
}

/**
 * Render component outside of .njk files
 * @param {string} name - component name
 * @param {object} [params] - component params
 * @param {Array} [caller] - caller array
 * @returns {string}
 */
function renderComponent(name, params = {}, caller = []) {
  const macroPath = `${name}/macro.njk`

  return renderString(name, params, macroPath, caller)
}

function renderIcon(name, params = {}) {
  const macroPath = `icons/${name}/macro.njk`

  return renderString(name, params, macroPath)
}

export { renderIcon, renderComponent }
