import { camelCase } from 'lodash'

import { nunjucksEnvironment } from '~/src/config/nunjucks'

/**
 * Render component outside of .njk files
 *
 * @param name
 * @param params
 * @returns {*}
 */
function renderComponent(name, params) {
  const macroPath = `${name}/macro.njk`
  const macroName = `app${
    name.charAt(0).toUpperCase() + camelCase(name.slice(1))
  }`
  const macroParams = JSON.stringify(params, null, 2)
  const macroString = `{%- from "${macroPath}" import ${macroName} -%}{{- ${macroName}(${macroParams}) -}}`

  return nunjucksEnvironment.renderString(macroString)
}

export { renderComponent }
