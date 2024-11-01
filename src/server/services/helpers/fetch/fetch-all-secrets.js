import { config } from '~/src/config/index.js'
import { fetcher } from '~/src/server/common/helpers/fetch/fetcher.js'
import { createLogger } from '~/src/server/common/helpers/logging/logger.js'

async function fetchAllSecrets(serviceName) {
  try {
    const endpoint = config.get('portalBackendUrl') + `/secrets/${serviceName}`
    const { data } = await fetcher(endpoint)

    return data
  } catch (error) {
    // A 404 can be thrown when a service has not had secrets set up on an environment
    createLogger().info(
      error,
      'Secrets not found, has service had secrets set up on this environment?'
    )
    return {}
  }
}

export { fetchAllSecrets }
