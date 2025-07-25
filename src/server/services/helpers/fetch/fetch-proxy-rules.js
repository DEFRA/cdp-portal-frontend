import { config } from '../../../../config/config.js'
import { fetchJson } from '../../../common/helpers/fetch/fetch-json.js'
import { createLogger } from '../../../common/helpers/logging/logger.js'

const logger = createLogger()

export async function fetchProxyRules(serviceName, environment) {
  const endpoint =
    config.get('portalBackendUrl') +
    `/squid-proxy-config/${serviceName}/${environment}/`
  try {
    const { payload } = await fetchJson(endpoint)
    return payload
  } catch (error) {
    logger.debug(error, 'Proxy rules error')
    return null
  }
}
