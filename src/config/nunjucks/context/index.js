import path from 'path'

import { appConfig } from '~/src/config'
import { isXhr } from '~/src/server/common/helpers/is-xhr'
import { createLogger } from '~/src/server/common/helpers/logger'
import { buildNavigation } from '~/src/config/nunjucks/context/build-navigation'
import { blankOption } from '~/src/server/common/helpers/blank-option'
import { noValue } from '~/src/server/common/constants/no-value'

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
    noValue,
    blankOption,
    isXhr: isXhr.call(request),
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
