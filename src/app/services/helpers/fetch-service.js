import fetch from 'node-fetch'
import { config } from '~/src/config'
import { createLogger } from '~/src/common/helpers/logger'

async function fetchService(serviceId) {
  const logger = createLogger()
  const serviceEndpointUrl = `${config.get('apiUrl')}/services/${serviceId}`

  try {
    const response = await fetch(serviceEndpointUrl)
    const service = await response.json()

    return service
  } catch (error) {
    logger.error(error)
    return []
  }
}

export { fetchService }
