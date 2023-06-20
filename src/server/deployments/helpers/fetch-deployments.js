import fetch from 'node-fetch'
import { appConfig } from '~/src/config'
import { createLogger } from '~/src/server/common/helpers/logger'

async function fetchDeployments() {
  const logger = createLogger()
  const deploymentsEndpointUrl = `${appConfig.get(
    'deploymentsV1ApiUrl'
  )}/deployments`

  try {
    const response = await fetch(deploymentsEndpointUrl)
    return await response.json()
  } catch (error) {
    logger.error(error)
    return []
  }
}

export { fetchDeployments }
