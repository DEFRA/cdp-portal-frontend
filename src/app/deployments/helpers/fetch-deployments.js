import fetch from 'node-fetch'
import { config } from '~/src/config'
import { createLogger } from '~/src/common/helpers/logger'

async function fetchDeployments() {
  const logger = createLogger()
  const deploymentsEndpointUrl = `${config.get('apiUrl')}/deployments`

  try {
    const response = await fetch(deploymentsEndpointUrl)
    const deployments = await response.json()

    return deployments.sort((a, b) => {
      if (a.timestamp < b.timestamp) {
        return 1
      }
      if (a.timestamp > b.timestamp) {
        return -1
      }
      return 0
    })
  } catch (error) {
    logger.error(error)
    return []
  }
}

export { fetchDeployments }
