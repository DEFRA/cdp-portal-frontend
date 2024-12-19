import Blankie from 'blankie'

import { config } from '~/src/config/config.js'
import { getAllEnvironmentKebabNames } from '~/src/server/common/helpers/environments/get-environments.js'

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
    scriptSrc: ['self', 'data:', 'unsafe-inline'],
    styleSrc: ['self', 'data:', 'unsafe-inline'],
    imgSrc: ['self', 'data:'],
    frameSrc: ['self', 'data:', ...terminalProxyDomains],
    generateNonces: false
  }
}

export { contentSecurityPolicy }
