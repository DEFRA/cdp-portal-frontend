import { config } from '~/src/config/config.js'
import { fetcher } from '~/src/server/common/helpers/fetch/fetcher.js'

async function fetchExistingServiceInfo(environment, imageName) {
  try {
    const endpoint =
      config.get('portalBackendUrl') +
      `/v2/deployment-config/${imageName}/${environment}`
    const { data } = await fetcher(endpoint)

    return data
  } catch (error) {
    if (error.output.statusCode === 404) {
      return null
    }

    throw error
  }
}

export { fetchExistingServiceInfo }
