import camelCase from 'lodash/camelCase.js'
import upperFirst from 'lodash/upperFirst.js'

import { nunjucksEnvironment } from '../../../../config/nunjucks/index.js'

const macroNameCache = new Map()

function getMacroName(name) {
  if (!macroNameCache.has(name)) {
    macroNameCache.set(name, `app${upperFirst(camelCase(name))}`)
  }
  return macroNameCache.get(name)
}

function renderString(name, params, macroPath, callBlock = []) {
  const macroName = getMacroName(name)
  const macroParams = JSON.stringify(params, null, 2)
  let macroString = `{%- from "${macroPath}" import ${macroName} -%}`

  if (Array.isArray(callBlock) && callBlock.length > 0) {
    macroString += `{% call ${macroName}(${macroParams}) %} ${callBlock.join(' ')} {% endcall %}`
  } else {
    macroString += `{{- ${macroName}(${macroParams}) -}}`
  }

  return nunjucksEnvironment.renderString(macroString, {})
}

/**
 * Render component outside of .njk files
 * @param {string} name - component name
 * @param {object} [params] - component params
 * @param {Array} [callBlock] - caller array
 * @returns {string}
 */
function renderComponent(name, params = {}, callBlock = []) {
  const macroPath = `${name}/macro.njk`

  return renderString(name, params, macroPath, callBlock)
}

function renderIcon(name, params = {}) {
  const macroPath = `icons/${name}/macro.njk`

  return renderString(name, params, macroPath)
}

export { renderIcon, renderComponent }
