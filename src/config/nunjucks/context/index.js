import path from 'node:path'
import { readFileSync } from 'node:fs'
import useragent from 'useragent'

import { config } from '~/src/config/index.js'
import { isXhr } from '~/src/server/common/helpers/is-xhr.js'
import { createLogger } from '~/src/server/common/helpers/logging/logger.js'
import { buildNavigation } from '~/src/config/nunjucks/context/build-navigation.js'
import { defaultOption } from '~/src/server/common/helpers/options/default-option.js'
import { noValue } from '~/src/server/common/constants/no-value.js'
import { userIsTeamMember } from '~/src/server/common/helpers/user/user-is-team-member.js'
import { userIsMemberOfATeam } from '~/src/server/common/helpers/user/user-is-member-of-a-team.js'
import { eventName } from '~/src/client/common/constants/event-name.js'

const logger = createLogger()
const assetPath = config.get('assetPath')
const manifestPath = path.join(
  config.get('root'),
  '.public/assets-manifest.json'
)
/** @type {Record<string, string> | undefined} */
let webpackManifest

/**
 * @param {Request | null} request
 */
async function context(request) {
  if (!webpackManifest) {
    try {
      webpackManifest = JSON.parse(readFileSync(manifestPath, 'utf-8'))
    } catch (error) {
      logger.error(error, `Webpack ${path.basename(manifestPath)} not found`)
    }
  }

  const userAgentHeader = request.headers['user-agent']
  const authedUser = await request.getUserSession()

  function getAssetPath(asset) {
    const webpackAssetPath = webpackManifest[asset]

    return `${assetPath}/${webpackAssetPath}`
  }

  return {
    appBaseUrl: config.get('appBaseUrl'),
    assetPath: `${assetPath}/assets`,
    authedUser,
    blankOption: defaultOption,
    breadcrumbs: [],
    containerVersion: config.get('containerVersion'),
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

/**
 * @import { Request } from '@hapi/hapi'
 */
