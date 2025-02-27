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

const logger = createLogger()
const assetPath = config.get('assetPath')
const manifestPath = path.join(
  config.get('root'),
  '.public/assets-manifest.json'
)
/** @type {Record<string, string> | undefined} */
let webpackManifest

/**
 * @param {import('@hapi/hapi').Request | null} request
 */
async function context(request) {
  if (!webpackManifest) {
    try {
      webpackManifest = JSON.parse(readFileSync(manifestPath, 'utf-8'))
    } catch (error) {
      logger.error(error, `Webpack ${path.basename(manifestPath)} not found`)
    }
  }

  const authedUser = await request.getUserSession()

  function getAssetPath(asset) {
    const webpackAssetPath = webpackManifest[asset]

    return `${assetPath}/${webpackAssetPath}`
  }

  const announcements = getAnnouncements(authedUser)

  const serviceConfig = config.get('service')

  return {
    appBaseUrl: config.get('appBaseUrl'),
    assetPath: `${assetPath}/assets`,
    announcements,
    authedUser,
    blankOption: defaultOption,
    breadcrumbs: [],
    serviceName: serviceConfig.name,
    serviceVersion: serviceConfig.version,
    serviceEnvironment: serviceConfig.environment,
    eventName,
    getAssetPath,
    githubOrg: config.get('githubOrg'),
    isAdmin: authedUser?.isAdmin ?? false,
    isAuthenticated: authedUser?.isAuthenticated ?? false,
    isIe: isIe(request.headers['user-agent']),
    isTenant: authedUser?.isTenant ?? false,
    isXhr: isXhr.call(request),
    navigation: await buildNavigation(request),
    noValue,
    routeLookup: (id, options) => request.routeLookup(id, options),
    supportChannel: config.get('supportChannel'),
    userIsMemberOfATeam: userIsMemberOfATeam(authedUser),
    userIsTeamMember: userIsTeamMember(authedUser)
  }
}

export { context }
