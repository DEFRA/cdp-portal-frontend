import Blankie from 'blankie'

import { config } from '#config/config.js'
import { orderedEnvironments } from '@defra/cdp-validation-kit'

const terminalProxyUrl = config.get('terminalProxyUrl')
const terminalProxyDomains = [
  ...new Set(
    orderedEnvironments.map((environment) =>
      terminalProxyUrl.replace('{environment}', environment)
    )
  )
]

const grafanaUrl = config.get('grafanaUrl')
const grafanaDomains = [
  ...new Set(
    orderedEnvironments.map((environment) =>
      grafanaUrl.replace('{environment}', environment)
    )
  )
]

/**
 * @satisfies {import('@hapi/hapi').Plugin}
 */
const contentSecurityPolicy = {
  plugin: Blankie,
  options: {
    defaultSrc: ['self'],
    fontSrc: ['self', 'data:'],
    connectSrc: ['self', 'data:', 'ws:'],
    scriptSrc: ['self', 'data:', 'unsafe-inline', 'https://cdn.jsdelivr.net'],
    styleSrc: ['self', 'data:', 'unsafe-inline', 'https://cdn.jsdelivr.net'],
    imgSrc: ['self', 'data:'],
    frameSrc: ['self', 'data:', ...terminalProxyDomains, ...grafanaDomains],
    generateNonces: false
  }
}

export { contentSecurityPolicy }
