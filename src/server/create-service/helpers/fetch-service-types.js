import fetch from 'node-fetch'
import { appConfig } from '~/src/config'
import { createLogger } from '~/src/server/common/helpers/logger'

async function fetchServiceTypes() {
  const logger = createLogger()
  const serviceTypesEndpointUrl = `${appConfig.get(
    'teamsAndRepositoriesApiUrl'
  )}/service-types`

  try {
    const response = await fetch(serviceTypesEndpointUrl)
    return await response.json()
  } catch (error) {
    logger.error(error)
    return []
  }
}

export { fetchServiceTypes }
