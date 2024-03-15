import useragent from 'useragent'
import path from 'path'

import { config } from '~/src/config'
import { isXhr } from '~/src/server/common/helpers/is-xhr'
import { createLogger } from '~/src/server/common/helpers/logging/logger'
import { buildNavigation } from '~/src/config/nunjucks/context/build-navigation'
import { defaultOption } from '~/src/server/common/helpers/options/default-option'
import { noValue } from '~/src/server/common/constants/no-value'
import { userIsTeamMember } from '~/src/server/common/helpers/user/user-is-team-member'
import { userIsMemberOfATeam } from '~/src/server/common/helpers/user/user-is-member-of-a-team'
import { eventName } from '~/src/client/common/constants/event-name'

const logger = createLogger()
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
    isInAServiceTeam: authedUser?.isInAServiceTeam ?? false,
    authedUser,
    userIsTeamMember: userIsTeamMember(authedUser),
    userIsMemberOfATeam: userIsMemberOfATeam(authedUser),
    assetPath,
    appBaseUrl: config.get('appBaseUrl'),
    supportChannel: config.get('supportChannel'),
    userAgent: useragent.lookup(userAgentHeader),
    isIe: useragent.is(userAgentHeader).ie,
    eventName,
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
    },
    routeLookup: function (id, params) {
      if (!request.routeLookup) {
        throw new Error('The route-lookup plugin has not been registered!')
      }

      return request.routeLookup(id, params)
    }
  }
}

export { context }
