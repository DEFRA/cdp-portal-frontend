import fetch from 'node-fetch'
import { config } from '~/src/config'
import { createLogger } from '~/src/common/helpers/logger'

async function fetchServicesList() {
  const logger = createLogger()
  const servicesEndpointUrl = `${config.get('apiUrl')}/services`

  try {
    const response = await fetch(servicesEndpointUrl)
    const services = await response.json()

    return services
  } catch (error) {
    logger.error(error)
    return []
  }
}

export { fetchServicesList }
