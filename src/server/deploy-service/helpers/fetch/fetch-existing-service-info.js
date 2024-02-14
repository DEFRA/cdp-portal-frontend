import { config } from '~/src/config'
import { fetcher } from '~/src/server/common/helpers/fetch/fetcher'

async function fetchExistingServiceInfo(environment, imageName) {
  try {
    const endpoint =
      config.get('portalBackendApiUrl') +
      `/deployment-config/${imageName}/${environment}`
    const { json } = await fetcher(endpoint)

    return json
  } catch (error) {
    if (error.output.statusCode === 404) {
      return null
    }

    throw error
  }
}

export { fetchExistingServiceInfo }
