import path from 'path'

import { appConfig } from '~/src/config'
import { createLogger } from '~/src/common/helpers/logger'

const logger = createLogger()
const appPathPrefix = appConfig.get('appPathPrefix')
const manifestPath = path.resolve(
  appConfig.get('root'),
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
      text: 'Repositories',
      url: `${appPathPrefix}/repositories`,
      isActive: request.path.includes(`${appPathPrefix}/repositories`)
    },
    {
      text: 'Deployments',
      url: `${appPathPrefix}/deployments`,
      isActive: request.path.includes(`${appPathPrefix}/deployments`)
    },
    {
      text: 'Running',
      url: `${appPathPrefix}/running`,
      isActive: request.path.includes(`${appPathPrefix}/running`)
    }
  ]
}

function context(request) {
  return {
    version: appConfig.get('version'),
    serviceName: appConfig.get('serviceName'),
    serviceUrl: appConfig.get('appPathPrefix'),
    breadcrumbs: [],
    navigation: buildNavigation(request),
    getAssetPath: function (asset) {
      const webpackAssetPath = webpackManifest[asset]

      return `${appPathPrefix}/public/${webpackAssetPath}`
    }
  }
}

export { context }
