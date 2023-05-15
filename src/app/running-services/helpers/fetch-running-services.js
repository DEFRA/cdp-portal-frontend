import fetch from 'node-fetch'
import { appConfig } from '~/src/config'
import { createLogger } from '~/src/common/helpers/logger'

async function fetchRunningServices() {
  const logger = createLogger()
  const runningServicesEndpointUrl = `${appConfig.get(
    'deploymentsV1ApiUrl'
  )}/whats-running-where`

  try {
    const response = await fetch(runningServicesEndpointUrl)
    return await response.json()
  } catch (error) {
    logger.error(error)
    return []
  }
}

export { fetchRunningServices }
