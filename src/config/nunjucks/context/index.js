import path from 'path'

import { appConfig } from '~/src/config'
import { createLogger } from '~/src/common/helpers/logger'
import { buildNavigation } from '~/src/config/nunjucks/context/build-navigation'

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

function context(request) {
  return {
    appPathPrefix,
    version: appConfig.get('version'),
    serviceName: appConfig.get('serviceName'),
    breadcrumbs: [],
    navigation: buildNavigation(request),
    getAssetPath: function (asset) {
      const webpackAssetPath = webpackManifest[asset]

      return `${appPathPrefix}/public/${webpackAssetPath}`
    }
  }
}

export { context }
