import fetch from 'node-fetch'
import { appConfig } from '~/src/config'
import { createLogger } from '~/src/app/common/helpers/logger'

async function fetchService(serviceId) {
  const logger = createLogger()
  const repositoryEndpointUrl = `${appConfig.get(
    'apiUrl'
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
