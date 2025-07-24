import { config } from '../../../../config/config.js'
import { fetchJson } from '../../../common/helpers/fetch/fetch-json.js'
import { createLogger } from '../../../common/helpers/logging/logger.js'

const logger = createLogger()

async function fetchAllSecrets(serviceName) {
  const endpoint = config.get('portalBackendUrl') + `/secrets/${serviceName}`

  try {
    const { payload } = await fetchJson(endpoint)
    return payload
  } catch (error) {
    logger.debug(error, 'Secrets error')
    return null
  }
}

export { fetchAllSecrets }
