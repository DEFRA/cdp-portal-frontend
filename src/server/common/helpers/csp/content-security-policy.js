import Blankie from 'blankie'

import { config } from '../../../../config/config.js'
import { getAllEnvironmentKebabNames } from '../environments/get-environments.js'

const terminalProxyUrl = config.get('terminalProxyUrl')
const terminalProxyDomains = [
  ...new Set(
    getAllEnvironmentKebabNames().map((environment) =>
      terminalProxyUrl.replace('{environment}', environment)
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
    connectSrc: ['self', 'data:'],
    scriptSrc: ['self', 'data:', 'unsafe-inline', 'https://cdn.jsdelivr.net'],
    styleSrc: ['self', 'data:', 'unsafe-inline', 'https://cdn.jsdelivr.net'],
    imgSrc: ['self', 'data:'],
    frameSrc: ['self', 'data:', ...terminalProxyDomains],
    generateNonces: false
  }
}

export { contentSecurityPolicy }
