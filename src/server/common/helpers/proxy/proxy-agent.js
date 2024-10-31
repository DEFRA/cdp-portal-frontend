import { URL } from 'node:url'
import { HttpsProxyAgent } from 'https-proxy-agent'

import { config } from '~/src/config/index.js'

// TODO this needs updating to use the proxy work in user-service-backend

/**
 * @typedef {object} ProxyAgent
 * @property {URL} url
 * @property {HttpsProxyAgent} agent
 */

/**
 * Get the proxy agent
 * @returns {ProxyAgent|null}
 */
function proxyAgent() {
  const proxy = config.get('httpsProxy') ?? config.get('httpProxy')

  if (proxy) {
    const proxyUrl = new URL(proxy)

    return {
      url: proxyUrl,
      agent: new HttpsProxyAgent(proxyUrl)
    }
  }

  return null
}

export { proxyAgent }
