import { removeOptionalParam } from '../route-lookup/remove-optional-param.js'

/**
 * Populates path parameters in a URL template with the provided parameters
 * @param {Record<string, string>} params
 * @param {string} urlTemplate
 * @returns {string}
 */
function populatePathParams(params, urlTemplate) {
  return Object.entries(params).reduce(
    (pathWithParams, [key, value]) => {
      const regex = new RegExp(`{${key}\\??}`, 'gi')
      return pathWithParams.replace(regex, encodeURI(value))
    },
    removeOptionalParam(urlTemplate, params)
  )
}

export { populatePathParams }
