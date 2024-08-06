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

  function getAssetPath(asset) {
    const webpackAssetPath = webpackManifest[asset]

    return `${assetPath}/${webpackAssetPath}`
  }

  return {
    appBaseUrl: config.get('appBaseUrl'),
    assetPath,
    authedUser,
    blankOption: defaultOption,
    breadcrumbs: [],
    eventName,
    getAssetPath,
    githubOrg: config.get('githubOrg'),
    isAdmin: authedUser?.isAdmin ?? false,
    isAuthenticated: authedUser?.isAuthenticated ?? false,
    isIe: useragent.is(userAgentHeader).ie,
    isTenant: authedUser?.isTenant ?? false,
    isXhr: isXhr.call(request),
    navigation: await buildNavigation(request),
    noValue,
    routeLookup: (id, options) => request.routeLookup(id, options),
    serviceName: config.get('serviceName'),
    supportChannel: config.get('supportChannel'),
    userAgent: useragent.lookup(userAgentHeader),
    userIsMemberOfATeam: userIsMemberOfATeam(authedUser),
    userIsTeamMember: userIsTeamMember(authedUser)
  }
}

export { context }
