import nunjucks from 'nunjucks'
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

// TODO update the names of these functions
const compiledTemplateCache = new Map()

function getCompiledTemplate(macroPath, macroName, hasCallBlock) {
  const cacheKey = `${macroPath}:${hasCallBlock}`

  if (!compiledTemplateCache.has(cacheKey)) {
    let templateStr = `{%- from "${macroPath}" import ${macroName} -%}`

    if (hasCallBlock) {
      templateStr += `{% call ${macroName}(params) %} {{ caller() }} {% endcall %}`
    } else {
      templateStr += `{{- ${macroName}(params) -}}`
    }

    const compiled = nunjucks.compile(
      templateStr,
      nunjucksEnvironment,
      macroPath
    )
    compiledTemplateCache.set(cacheKey, compiled)
  }

  return compiledTemplateCache.get(cacheKey)
}

function renderCompiledTemplate(name, params, macroPath, callBlock = []) {
  const macroName = getMacroName(name)
  const hasCallBlock = Array.isArray(callBlock) && callBlock.length > 0
  const template = getCompiledTemplate(macroPath, macroName, hasCallBlock)

  const context = {
    params: params,
    callBlockContent: hasCallBlock ? callBlock.join(' ') : ''
  }

  return template.render(context)
}

function renderCachedComponent(name, params = {}, callBlock = []) {
  const macroPath = `${name}/macro.njk`

  return renderCompiledTemplate(name, params, macroPath, callBlock)
}

export { renderIcon, renderComponent, renderCachedComponent }
