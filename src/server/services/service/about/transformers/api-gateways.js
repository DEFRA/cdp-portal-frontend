import { sortKeyByEnv } from '~/src/server/common/helpers/sort/sort-by-env.js'
import { fetchApiGateways } from '~/src/server/services/helpers/fetch/fetch-api-gateways.js'

/**
 * @typedef {object} ApiGateway
 * @property {string} environment
 * @property {Array<string>} apis
 */

/**
 * Construct api gateway array of objects, for use in the template
 * @param {import('@hapi/hapi').Request} request
 * @returns {Promise<{ApiGateway}[]|null>}
 */
async function provideApiGateways(request) {
  const apis = await fetchApiGateways(request.params?.serviceId, request.logger)

  if (apis) {
    return Object.entries(apis)
      .map(([environment, { apiGateways }]) => ({
        environment,
        apis: apiGateways
      }))
      .sort(sortKeyByEnv('environment'))
  }

  return null
}

export { provideApiGateways }
