import fetch from 'node-fetch'
import { appConfig } from '~/src/config'
import { createLogger } from '~/src/common/helpers/logger'

async function fetchRunning() {
  const logger = createLogger()
  const runningEndpointUrl = `${appConfig.get('apiUrl')}/running`

  try {
    const response = await fetch(runningEndpointUrl)
    return await response.json()
  } catch (error) {
    logger.error(error)
    return []
  }
}

export { fetchRunning }
