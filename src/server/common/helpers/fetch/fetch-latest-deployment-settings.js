import { config } from '~/src/config/config.js'
import { fetchJson } from '~/src/server/common/helpers/fetch/fetch-json.js'

async function fetchLatestDeploymentSettings(environment, imageName) {
  try {
    const endpoint =
      config.get('portalBackendUrl') +
      `/deployment-settings/${imageName}/${environment}`
    const { payload } = await fetchJson(endpoint)

    return payload
  } catch (error) {
    if (error.output.statusCode === 404) {
      return null
    }

    throw error
  }
}

export { fetchLatestDeploymentSettings }
