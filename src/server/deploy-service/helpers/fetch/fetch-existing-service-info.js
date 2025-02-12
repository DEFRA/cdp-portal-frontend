import { config } from '~/src/config/config.js'
import { fetchJson } from '~/src/server/common/helpers/fetch/fetch-json.js'

async function fetchExistingServiceInfo(environment, imageName) {
  try {
    const endpoint =
      config.get('portalBackendUrl') +
      `/v2/deployment-config/${imageName}/${environment}`
    const { payload } = await fetchJson(endpoint)

    return payload
  } catch (error) {
    if (error.output.statusCode === 404) {
      return null
    }

    throw error
  }
}

export { fetchExistingServiceInfo }
