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

const globalContext = {
  version: config.get('version'),
  serviceName: config.get('serviceName'),
  getAssetPath: function (asset) {
    const webpackAssetPath = webpackManifest[asset]

    return `${config.get('appPathPrefix')}/public/${webpackAssetPath}`
  }
}

export { globalContext }
