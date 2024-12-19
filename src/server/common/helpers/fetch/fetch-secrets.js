import { config } from '~/src/config/index.js'
import { fetcher } from '~/src/server/common/helpers/fetch/fetcher.js'

async function fetchSecrets(environment, serviceName, logger) {
  try {
    const endpoint = `${config.get('portalBackendUrl')}/secrets/${environment}/${serviceName}`
    const { data } = await fetcher(endpoint, {}, false)

    return data
  } catch (error) {
    // A 404 can be thrown when a service has not had secrets set up on an environment
    logger.info(
      error,
      'Secrets not found, has service had secrets set up on this environment?'
    )
    return null
  }
}

export { fetchSecrets }
