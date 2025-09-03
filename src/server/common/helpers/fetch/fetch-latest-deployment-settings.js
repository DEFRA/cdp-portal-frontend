import { config } from '../../../../config/config.js'
import { fetchJson } from './fetch-json.js'
import { statusCodes } from '@defra/cdp-validation-kit'

async function fetchLatestDeploymentSettings(environment, imageName) {
  try {
    const endpoint =
      config.get('portalBackendUrl') +
      `/deployment-settings/${imageName}/${environment}`
    const { payload } = await fetchJson(endpoint)

    return payload
  } catch (error) {
    if (error.output.statusCode === statusCodes.notFound) {
      return null
    }

    throw error
  }
}

export { fetchLatestDeploymentSettings }
