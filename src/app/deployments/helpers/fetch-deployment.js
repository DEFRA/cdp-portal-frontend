import fetch from 'node-fetch'
import { appConfig } from '~/src/config'
import { createLogger } from '~/src/app/common/helpers/logger'

async function fetchDeployment(deploymentId) {
  const logger = createLogger()
  const deploymentEndpointUrl = `${appConfig.get(
    'deploymentsV1ApiUrl'
  )}/deployments/${deploymentId}`

  try {
    const response = await fetch(deploymentEndpointUrl)
    return await response.json()
  } catch (error) {
    logger.error(error)
    return []
  }
}

export { fetchDeployment }
