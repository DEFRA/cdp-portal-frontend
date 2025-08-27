import path from 'node:path'
import { readFileSync } from 'node:fs'

import { config } from '../../config.js'
import { isXhr } from '../../../server/common/helpers/is-xhr.js'
import { isIe } from './is-ie.js'
import { createLogger } from '../../../server/common/helpers/logging/logger.js'
import { buildNavigation } from './build-navigation.js'
import { defaultOption } from '../../../server/common/helpers/options/default-option.js'
import { noValue } from '../../../server/common/constants/no-value.js'
import { eventName } from '../../../client/common/constants/event-name.js'
import { getAnnouncements } from './announcements.js'
import { hasScopeDecorator } from '../../../server/common/helpers/decorators/has-scope.js'
import { scopes } from '@defra/cdp-validation-kit/src/constants/scopes.js'

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
  const userSession = await request.getUserSession()
  const isInternetExplorer = isIe(request.headers['user-agent'])
  const announcements = getAnnouncements(userSession, isInternetExplorer)
  const serviceConfig = config.get('service')

  return {
    announcements,
    appBaseUrl: config.get('appBaseUrl'),
    appServiceName: serviceConfig.name,
    assetPath: `${assetPath}/assets`,
    userSession,
    blankOption: defaultOption,
    breadcrumbs: [],
    eventName,
    getAssetPath,
    githubOrg: config.get('githubOrg'),
    hasScope: hasScopeDecorator(request),
    isAdmin: userSession?.isAdmin ?? false,
    isAuthenticated: userSession?.isAuthenticated ?? false,
    isTenant: userSession?.isTenant ?? false,
    isXhr: isXhr.call(request),
    navigation: await buildNavigation(request),
    noValue,
    routeLookup: (id, options) => request.routeLookup(id, options),
    scopes,
    serviceEnvironment: serviceConfig.environment,
    serviceVersion: serviceConfig.version,
    supportChannel: config.get('supportChannel')
  }
}

export { context, getAssetPath }
