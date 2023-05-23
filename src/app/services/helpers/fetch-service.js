import fetch from 'node-fetch'
import { appConfig } from '~/src/config'
import { createLogger } from '~/src/common/helpers/logger'

async function fetchService(serviceId) {
  const logger = createLogger()
  const repositoryEndpointUrl = `${appConfig.get(
    'teamsAndRepositoriesV1ApiUrl'
  )}/services/${serviceId}`

  try {
    const response = await fetch(repositoryEndpointUrl)
    return await response.json()
  } catch (error) {
    logger.error(error)
    return []
  }
}

export { fetchService }
