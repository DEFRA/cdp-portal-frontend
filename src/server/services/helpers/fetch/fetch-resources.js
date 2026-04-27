import { config } from '#config/config.js'
import { fetchJson } from '#server/common/helpers/fetch/fetch-json.js'
import { createLogger } from '#server/common/helpers/logging/logger.js'

const logger = createLogger()

export async function fetchResources(serviceName, env = '') {
  const endpoint =
    config.get('portalBackendUrl') + `/entities/${serviceName}/resources/${env}`

  try {
    const { payload } = await fetchJson(endpoint)
    return payload
  } catch (error) {
    logger.debug(error, 'Resources error')
    return null
  }
}
