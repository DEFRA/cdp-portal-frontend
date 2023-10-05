import path from 'path'

import { config } from '~/src/config'
import { isXhr } from '~/src/server/common/helpers/is-xhr'
import { createLogger } from '~/src/server/common/helpers/logger'
import { buildNavigation } from '~/src/config/nunjucks/context/build-navigation'
import { defaultOption } from '~/src/server/common/helpers/default-option'
import { noValue } from '~/src/server/common/constants/no-value'
import { sessionNames } from '~/src/server/common/constants/session-names'

const logger = createLogger()
const appPathPrefix = config.get('appPathPrefix')
const assetPath = config.get('assetPath')

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

function context(request) {
  const authenticatedUser = request.yar._store
    ? request.yar.get(sessionNames.user)
    : {}

  return {
    isAuthenticated: authenticatedUser?.isAuthenticated,
    isAdmin: request.auth?.credentials?.isAdmin ?? false,
    authenticatedUser,
    appPathPrefix,
    assetPath,
    noValue,
    blankOption: defaultOption,
    isXhr: isXhr.call(request),
    version: config.get('version'),
    githubOrg: config.get('githubOrg'),
    serviceName: config.get('serviceName'),
    breadcrumbs: [],
    navigation: buildNavigation(request),
    getAssetPath: function (asset) {
      const webpackAssetPath = webpackManifest[asset]

      return `${assetPath}/${webpackAssetPath}`
    }
  }
}

export { context }
