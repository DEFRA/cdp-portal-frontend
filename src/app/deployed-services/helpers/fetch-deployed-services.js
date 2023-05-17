import fetch from 'node-fetch'
import { appConfig } from '~/src/config'
import { createLogger } from '~/src/app/common/helpers/logger'

async function fetchDeployedServices() {
  const logger = createLogger()
  const deployedServicesEndpointUrl = `${appConfig.get(
    'deploymentsV1ApiUrl'
  )}/deployments`

  try {
    const response = await fetch(deployedServicesEndpointUrl)
    return await response.json()
  } catch (error) {
    logger.error(error)
    return []
  }
}

export { fetchDeployedServices }
