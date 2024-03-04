import { camelCase, upperFirst } from 'lodash'

import { nunjucksEnvironment } from '~/src/config/nunjucks'

function renderString(name, params, macroPath) {
  const macroName = `app${upperFirst(camelCase(name))}`
  const macroParams = JSON.stringify(params, null, 2)
  const macroString = `{%- from "${macroPath}" import ${macroName} -%} {{- ${macroName}(${macroParams}) -}}`

  return nunjucksEnvironment.renderString(macroString)
}

function renderComponent(name, params) {
  const macroPath = `${name}/macro.njk`

  return renderString(name, params, macroPath)
}

function renderIcon(name, params) {
  const macroPath = `icons/${name}/macro.njk`

  return renderString(name, params, macroPath)
}

export { renderComponent, renderIcon }
