import Blankie from 'blankie'

import { config } from '~/src/config/index.js'
import { getAllEnvironmentKebabNamesExceptProd } from '~/src/server/common/helpers/environments/get-environments.js'

const terminalProxyUrl = config.get('terminalProxyUrl')
const terminalProxyDomains = [
  ...new Set(
    getAllEnvironmentKebabNamesExceptProd().map((environment) =>
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
    connectSrc: ['self'],
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
