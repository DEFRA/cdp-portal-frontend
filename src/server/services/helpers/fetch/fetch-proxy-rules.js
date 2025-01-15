import Boom from '@hapi/boom'

import { config } from '~/src/config/config.js'
import { fetcher } from '~/src/server/common/helpers/fetch/fetcher.js'
import { createLogger } from '~/src/server/common/helpers/logging/logger.js'

const logger = createLogger()

export async function fetchProxyRules(serviceName, environment) {
  try {
    const endpoint =
      config.get('portalBackendUrl') +
      `/squid-proxy-config/${serviceName}/${environment}/`
    const { data } = await fetcher(endpoint)

    return data
  } catch (error) {
    if (error.output?.statusCode === 404) {
      logger.info(
        'Proxy rules not found, service probably not set it up on this environment'
      )
      return {}
    }
    logger.warn(error, 'Looking up Proxy rules error')
    throw Boom.boomify(new Error(error.message), {
      statusCode: error?.output?.statusCode ?? 500
    })
  }
}
