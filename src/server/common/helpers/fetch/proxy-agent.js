import { URL } from 'node:url'
import { HttpsProxyAgent } from 'https-proxy-agent'

import { config } from '~/src/config'
import { createLogger } from '~/src/server/common/helpers/logging/logger'

const proxyAgent = () => {
  const logger = createLogger()
  const proxy = config.get('httpsProxy') ?? config.get('httpProxy')

  logger.info(`Proxy: ${proxy}`)

  if (!proxy) {
    return null
  } else {
    const proxyUrl = new URL(proxy)
    logger.info(`Proxy url: ${proxyUrl}, ${proxyUrl.href}`)

    return {
      url: proxyUrl,
      agent: new HttpsProxyAgent(proxyUrl)
    }
  }
}

export { proxyAgent }
