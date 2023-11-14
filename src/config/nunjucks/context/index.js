import useragent from 'useragent'
import path from 'path'

import { config } from '~/src/config'
import { isXhr } from '~/src/server/common/helpers/is-xhr'
import { createLogger } from '~/src/server/common/helpers/logging/logger'
import { buildNavigation } from '~/src/config/nunjucks/context/build-navigation'
import { defaultOption } from '~/src/server/common/helpers/default-option'
import { noValue } from '~/src/server/common/constants/no-value'
import { userHasTeamScope } from '~/src/server/common/helpers/user/user-has-team-scope'

const logger = createLogger()
const appBaseUrl = config.get('appBaseUrl')
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

async function context(request) {
  const userAgentHeader = request.headers['user-agent']
  const authedUser = await request.getUserSession()

  return {
    isAuthenticated: authedUser?.isAuthenticated ?? false,
    isAdmin: authedUser?.isAdmin ?? false,
    isInServiceTeam: authedUser?.isInServiceTeam ?? false,
    authedUser,
    userHasTeamScope: userHasTeamScope(authedUser),
    appBaseUrl,
    appPathPrefix,
    assetPath,
    supportChannel: config.get('supportChannel'),
    userAgent: useragent.lookup(userAgentHeader),
    isIe: useragent.is(userAgentHeader).ie,
    noValue,
    blankOption: defaultOption,
    isXhr: isXhr.call(request),
    githubOrg: config.get('githubOrg'),
    serviceName: config.get('serviceName'),
    breadcrumbs: [],
    navigation: await buildNavigation(request),
    getAssetPath: function (asset) {
      const webpackAssetPath = webpackManifest[asset]

      return `${assetPath}/${webpackAssetPath}`
    }
  }
}

export { context }
