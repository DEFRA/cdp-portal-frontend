import { createLogger } from '../logging/logger.js'
import Https from 'node:https'
import Wreck from '@hapi/wreck'

const logger = createLogger()

/**
 * Proxy support is handled by Node.js via HTTPS_PROXY + NODE_USE_ENV_PROXY (Node 20+).
 * Most clients (e.g. undici, node-fetch) work automatically.
 * Wreck requires explicitly using the global agent.
 */
export function setupProxy() {
  if (process.env.HTTPS_PROXY) {
    logger.info('Routing outbound requests via proxy')

    // Required for Wreck
    Wreck.agents = Https.globalAgent
  }
}
