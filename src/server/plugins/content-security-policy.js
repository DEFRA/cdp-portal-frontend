import Blankie from 'blankie'

import { config } from '#config/config.js'
import { getAllEnvironmentKebabNames } from '#server/common/helpers/environments/get-environments.js'

const terminalProxyUrl = config.get('terminalProxyUrl')
const terminalProxyDomains = [
  ...new Set(
    getAllEnvironmentKebabNames().map((environment) =>
      terminalProxyUrl.replace('{environment}', environment)
    )
  )
]

const grafanaUrl = config.get('grafanaUrl')
const grafanaDomains = [
  ...new Set(
    getAllEnvironmentKebabNames().map((environment) =>
      grafanaUrl.replace('{environment}', environment)
    )
  )
]

const s3Endpoint = config.get('aws').s3.endpoint

/**
 * @satisfies {import('@hapi/hapi').Plugin}
 */
const contentSecurityPolicy = {
  plugin: Blankie,
  options: {
    defaultSrc: ['self'],
    fontSrc: ['self', 'data:'],
    connectSrc: ['self', 'data:', 'ws:', s3Endpoint], // TODO S3 host as config
    scriptSrc: ['self', 'data:', 'unsafe-inline', 'https://cdn.jsdelivr.net'],
    styleSrc: ['self', 'data:', 'unsafe-inline', 'https://cdn.jsdelivr.net'],
    imgSrc: ['self', 'data:'],
    frameSrc: ['self', 'data:', ...terminalProxyDomains, ...grafanaDomains],
    generateNonces: false
  }
}

export { contentSecurityPolicy }
