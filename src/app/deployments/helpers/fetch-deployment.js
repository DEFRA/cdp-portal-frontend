import fetch from 'node-fetch'
import { config } from '~/src/config'
import { createLogger } from '~/src/common/helpers/logger'

async function fetchDeployment(deploymentId) {
  const logger = createLogger()
  const deploymentEndpointUrl = `${config.get(
    'apiUrl'
  )}/deployments/${deploymentId}`

  try {
    const response = await fetch(deploymentEndpointUrl)
    const deployment = await response.json()

    return deployment
  } catch (error) {
    logger.error(error)
    return []
  }
}

export { fetchDeployment }
