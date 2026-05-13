import { populatePathParams } from './populate-path-params.js'

/**
 * Populate urls with values from stepData and params
 * @param {StepData} stepData
 * @param {object} params
 * @param {Record<string, string>} urlTemplates
 * @returns {{}}
 */
function populateUrls({ stepData, params, urlTemplates }) {
  return Object.entries(urlTemplates).reduce(
    (urlMap, [key, template]) => ({
      ...urlMap,
      [key]: populatePathParams({ ...stepData, ...params }, template)
    }),
    {}
  )
}

export { populateUrls }
