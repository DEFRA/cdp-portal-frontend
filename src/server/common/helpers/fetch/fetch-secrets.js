import { config } from '../../../../config/config.js'
import { fetchJson } from './fetch-json.js'
import { createLogger } from '../logging/logger.js'

const logger = createLogger()

async function fetchSecrets(environment, serviceName) {
  try {
    const endpoint =
      config.get('portalBackendUrl') + `/secrets/${environment}/${serviceName}`
    const { payload } = await fetchJson(endpoint)

    return payload
  } catch (error) {
    // We are catching here because a 404 can be thrown when a service has not had secrets set up on an environment
    logger.info(
      error,
      'Secrets not found, has service had secrets set up on this environment?'
    )
    return null
  }
}

export { fetchSecrets }
