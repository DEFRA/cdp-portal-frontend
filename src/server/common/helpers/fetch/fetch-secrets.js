import { config } from '~/src/config/config.js'
import { fetcher } from '~/src/server/common/helpers/fetch/fetcher.js'

async function fetchSecrets(environment, serviceName, logger) {
  try {
    const endpoint =
      config.get('portalBackendUrl') + `/secrets/${environment}/${serviceName}`
    const { data } = await fetcher(endpoint)

    return data
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
