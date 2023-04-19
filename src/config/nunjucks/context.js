import path from 'path'

import { config } from '~/src/config'
import { createLogger } from '~/src/common/helpers/logger'

const logger = createLogger()
const appPathPrefix = config.get('appPathPrefix')
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

function buildNavigation(request) {
  return [
    {
      text: 'Home',
      url: appPathPrefix,
      isActive: request.path === `${appPathPrefix}`
    },
    {
      text: 'Services',
      url: `${appPathPrefix}/services`,
      isActive: request.path.includes(`${appPathPrefix}/services`)
    },
    {
      text: 'Deployments',
      url: `${appPathPrefix}/deployments`,
      isActive: request.path.includes(`${appPathPrefix}/deployments`)
    }
  ]
}

function context(request) {
  return {
    version: config.get('version'),
    serviceName: config.get('serviceName'),
    serviceUrl: config.get('appPathPrefix'),
    breadcrumbs: [],
    navigation: buildNavigation(request),
    getAssetPath: function (asset) {
      const webpackAssetPath = webpackManifest[asset]

      return `${appPathPrefix}/public/${webpackAssetPath}`
    }
  }
}

export { context }
