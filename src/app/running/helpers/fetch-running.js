import fetch from 'node-fetch'
import { config } from '~/src/config'
import { createLogger } from '~/src/common/helpers/logger'

async function fetchRunning() {
  const logger = createLogger()
  const runningEndpointUrl = `${config.get('apiUrl')}/running`

  try {
    const response = await fetch(runningEndpointUrl)
    const running = await response.json()

    return running
  } catch (error) {
    logger.error(error)
    return []
  }
}

export { fetchRunning }
