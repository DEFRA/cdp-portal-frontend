import fetch from 'node-fetch'
import { appConfig } from '~/src/config'
import { createLogger } from '~/src/app/common/helpers/logger'

async function fetchServices() {
  const logger = createLogger()
  const servicesEndpointUrl = `${appConfig.get('apiUrl')}/services`

  try {
    const response = await fetch(servicesEndpointUrl)
    return await response.json()
  } catch (error) {
    logger.error(error)
    return []
  }
}

export { fetchServices }
