import Blankie from 'blankie'

import { config, environments } from '~/src/config'

const terminalProxyUrl = config.get('terminalProxyUrl')
const terminalProxyDomains = [
  ...new Set(
    Object.values(environments)
      .filter((environment) => environment !== 'prod')
      .map((environment) =>
        terminalProxyUrl.replace('{environment}', environment)
      )
  )
]

/**
 * @satisfies {Plugin}
 */
const contentSecurityPolicy = {
  plugin: Blankie,
  options: {
    defaultSrc: ['self'],
    fontSrc: ['self', 'data:'],
    connectSrc: ['self', ...terminalProxyDomains],
    scriptSrc: ['self', 'unsafe-inline'],
    styleSrc: ['self', 'unsafe-inline'],
    imgSrc: ['self', 'data:'],
    frameSrc: ['self', 'data:', ...terminalProxyDomains],
    generateNonces: false
  }
}

export { contentSecurityPolicy }

/**
 * @import { Plugin } from '@hapi/hapi'
 */
