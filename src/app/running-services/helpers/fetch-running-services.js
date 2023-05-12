import fetch from 'node-fetch'
import { appConfig } from '~/src/config'
import { createLogger } from '~/src/common/helpers/logger'

async function fetchRunningServices() {
  const logger = createLogger()
  const runningServicesEndpointUrl = `${appConfig.get(
    'apiUrl'
  )}/running-services`

  try {
    const response = await fetch(runningServicesEndpointUrl)
    return await response.json()
  } catch (error) {
    logger.error(error)
    return []
  }
}

export { fetchRunningServices }
