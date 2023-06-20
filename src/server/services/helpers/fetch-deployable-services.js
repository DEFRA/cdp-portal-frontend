import fetch from 'node-fetch'
import { appConfig } from '~/src/config'
import { createLogger } from '~/src/server/common/helpers/logger'

async function fetchDeployableServices() {
  const logger = createLogger()
  const servicesEndpointUrl = `${appConfig.get('deployablesV1ApiUrl')}/services`

  try {
    const response = await fetch(servicesEndpointUrl)
    return await response.json()
  } catch (error) {
    logger.error(error)
    return []
  }
}

export { fetchDeployableServices }
