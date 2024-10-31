import Wreck from '@hapi/wreck'

import { createLogger } from '~/src/server/common/helpers/logging/logger.js'

/**
 * Provide Wreck http client agents
 * @param {ProxyAgent} proxy
 */
function setupWreckAgents(proxy) {
  if (proxy?.agent) {
    createLogger().info('Wreck agents setup')

    Wreck.agents = {
      https: proxy.agent,
      http: proxy.agent,
      httpsAllowUnauthorized: proxy.agent
    }
  }
}

export { setupWreckAgents }
/**
 * import {ProxyAgent} from '~/src/server/common/helpers/proxy/proxy-agent.js'
 */
