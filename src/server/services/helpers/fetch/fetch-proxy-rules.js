import { config } from '~/src/config/config.js'
import { fetcher } from '~/src/server/common/helpers/fetch/fetcher.js'
import { createLogger } from '~/src/server/common/helpers/logging/logger.js'

const logger = createLogger()

export async function fetchProxyRules(serviceName, environment) {
  const endpoint =
    config.get('portalBackendUrl') +
    `/squid-proxy-config/${serviceName}/${environment}/`
  try {
    const { payload } = await fetcher(endpoint)
    return payload
  } catch (error) {
    logger.debug(error, 'Proxy rules error')
    return null
  }
}
