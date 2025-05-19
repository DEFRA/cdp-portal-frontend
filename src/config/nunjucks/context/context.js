import path from 'node:path'
import { readFileSync } from 'node:fs'

import { config } from '~/src/config/config.js'
import { isXhr } from '~/src/server/common/helpers/is-xhr.js'
import { isIe } from '~/src/config/nunjucks/context/is-ie.js'
import { createLogger } from '~/src/server/common/helpers/logging/logger.js'
import { buildNavigation } from '~/src/config/nunjucks/context/build-navigation.js'
import { defaultOption } from '~/src/server/common/helpers/options/default-option.js'
import { noValue } from '~/src/server/common/constants/no-value.js'
import { userIsTeamMember } from '~/src/server/common/helpers/user/user-is-team-member.js'
import { userIsMemberOfATeam } from '~/src/server/common/helpers/user/user-is-member-of-a-team.js'
import { eventName } from '~/src/client/common/constants/event-name.js'
import { getAnnouncements } from '~/src/config/nunjucks/context/announcements.js'
import { hasScopeDecorator } from '~/src/server/common/helpers/decorators/has-scope.js'
import { scopes } from '~/src/server/common/constants/scopes.js'

const logger = createLogger()
const assetPath = config.get('assetPath')

/**
 * Get asset path from assets-manifest.json
 * @param {string} asset
 * @returns {string}
 */
function getAssetPath(asset) {
  const manifestPath = path.join(
    config.get('root'),
    '.public/assets-manifest.json'
  )

  /** @type {Record<string, string> | undefined} */
  let webpackManifest

  if (!webpackManifest) {
    try {
      webpackManifest = JSON.parse(readFileSync(manifestPath, 'utf-8'))
    } catch (error) {
      logger.error(error, `Webpack ${path.basename(manifestPath)} not found`)
    }
  }

  const webpackAssetPath = webpackManifest[asset]

  return `${assetPath}/${webpackAssetPath}`
}

/**
 * @param {import('@hapi/hapi').Request | null} request
 */
async function context(request) {
  const authedUser = await request.getUserSession()
  const isInternetExplorer = isIe(request.headers['user-agent'])
  const announcements = getAnnouncements(authedUser, isInternetExplorer)
  const serviceConfig = config.get('service')

  return {
    announcements,
    appBaseUrl: config.get('appBaseUrl'),
    appServiceName: serviceConfig.name,
    assetPath: `${assetPath}/assets`,
    authedUser,
    blankOption: defaultOption,
    breadcrumbs: [],
    eventName,
    getAssetPath,
    githubOrg: config.get('githubOrg'),
    hasScope: hasScopeDecorator(request),
    isAdmin: authedUser?.isAdmin ?? false,
    isAuthenticated: authedUser?.isAuthenticated ?? false,
    isTenant: authedUser?.isTenant ?? false,
    isXhr: isXhr.call(request),
    navigation: await buildNavigation(request),
    noValue,
    routeLookup: (id, options) => request.routeLookup(id, options),
    scopes,
    serviceEnvironment: serviceConfig.environment,
    serviceVersion: serviceConfig.version,
    supportChannel: config.get('supportChannel'),
    userIsMemberOfATeam: userIsMemberOfATeam(authedUser),
    userIsTeamMember: userIsTeamMember(authedUser)
  }
}

export { context, getAssetPath }
