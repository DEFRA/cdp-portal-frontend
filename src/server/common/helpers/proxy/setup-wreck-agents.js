import Wreck from '@hapi/wreck'

import { createLogger } from '~/src/server/common/helpers/logging/logger.js'

/**
 * Set the Global Wreck agents
 * To disable for a specific instance pass the { agent: false } option
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
