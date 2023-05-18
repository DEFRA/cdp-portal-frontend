import fetch from 'node-fetch'
import { appConfig } from '~/src/config'
import { createLogger } from '~/src/app/common/helpers/logger'

async function fetchDeployedService(deploymentId) {
  const logger = createLogger()
  const deploymentEndpointUrl = `${appConfig.get(
    'apiUrl'
  )}/deployed-services/${deploymentId}`

  try {
    const response = await fetch(deploymentEndpointUrl)
    return await response.json()
  } catch (error) {
    logger.error(error)
    return []
  }
}

export { fetchDeployedService }
