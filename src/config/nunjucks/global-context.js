const path = require('path')

const { config } = require('../index')
const { createLogger } = require('../../common/helpers/logger')

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

module.exports.globalContext = {
  version: config.get('version'),
  serviceName: config.get('serviceName'),
  getAssetPath: function (asset) {
    const webpackAssetPath = webpackManifest[asset]

    return `/public/${webpackAssetPath}`
  }
}
