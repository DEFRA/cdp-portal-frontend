import path from 'path'

import { appConfig } from '~/src/config'
import { isXhr } from '~/src/server/common/helpers/is-xhr'
import { createLogger } from '~/src/server/common/helpers/logger'
import { buildNavigation } from '~/src/config/nunjucks/context/build-navigation'
import { blankOption } from '~/src/server/common/helpers/blank-option'
import { noValue } from '~/src/server/common/constants/no-value'
import { sessionNames } from '~/src/server/common/constants/session-names'

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
  const authSession = request.yar.get(sessionNames.auth) ?? null

  return {
    isAuthenticated: authSession && authSession?.isAuthenticated,
    userProfile: authSession && authSession.credentials.profile,
    appPathPrefix,
    noValue,
    blankOption,
    isXhr: isXhr.call(request),
    version: appConfig.get('version'),
    gitHubOrg: appConfig.get('gitHubOrg'),
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
