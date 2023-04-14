import path from 'path'

import { config } from '~/src/config'
import { createLogger } from '~/src/common/helpers/logger'

const logger = createLogger()
const manifestPath = path.resolve(
  config.get('root'),
  '.public',
  'manifest.json'
)
let webpackManifest

try {
  webpackManifest = require(manifestPath)
} catch (error) {
  logger.error('Webpack Manifest assets file not found')
}

function navigation(request) {
  return [
    {
      text: 'Home',
      url: 'cdp-portal-frontend', // TODO fix up having to hardcode this due to relative url without prefixed slash
      isActive: request.path === `${config.get('appPathPrefix')}`
    },
    {
      text: 'Deployments',
      url: 'cdp-portal-frontend/deployments',
      isActive: request.path === `${config.get('appPathPrefix')}/deployments`
    }
  ]
}

function context(request) {
  return {
    version: config.get('version'),
    serviceName: config.get('serviceName'),
    serviceUrl: config.get('appPathPrefix'),
    navigation: navigation(request),
    getAssetPath: function (asset) {
      const webpackAssetPath = webpackManifest[asset]

      return `${config.get('appPathPrefix')}/public/${webpackAssetPath}`
    }
  }
}

export { context }
