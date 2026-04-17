import path from 'node:path'
import { readFileSync } from 'node:fs'
import { scopes } from '@defra/cdp-validation-kit'

import { isXhr } from '#server/common/helpers/is-xhr.js'
import { isIe } from './is-ie.js'
import { createLogger } from '#server/common/helpers/logging/logger.js'
import { buildNavigation } from './build-navigation.js'
import { defaultOption } from '#server/common/helpers/options/default-option.js'
import { noValue } from '#server/common/constants/no-value.js'
import { eventName } from '#client/common/constants/event-name.js'
import { getAnnouncements } from './announcements.js'
import { hasScopeDecorator } from '#server/common/helpers/decorators/has-scope.js'
import { config } from '#config/config.js'

const logger = createLogger()
const assetPath = config.get('assetPath')
const manifestPath = path.join(
  config.get('root'),
  '.public/.vite/manifest.json'
)

let viteManifest

export function getAssetPath(asset) {
  if (!config.get('isProduction')) {
    return `${assetPath}/${asset}`
  }

  if (!viteManifest) {
    try {
      viteManifest = JSON.parse(readFileSync(manifestPath, 'utf-8'))
    } catch (error) {
      logger.error(`Vite ${path.basename(manifestPath)} not found`)
    }
  }

  const viteAssetPath = viteManifest?.[asset]?.file
  return `${assetPath}/${viteAssetPath ?? asset}`
}

/**
 * @param {import('@hapi/hapi').Request | null} request
 */
export async function context(request) {
  const userSession = request?.auth?.credentials
  const isInternetExplorer = isIe(request.headers['user-agent'])
  const announcements = await getAnnouncements({
    request,
    userSession,
    isInternetExplorer
  })
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
    navigation: await buildNavigation(request, userSession),
    noValue,
    routeLookup: (id, options) => request.routeLookup(id, options),
    requestPath: request.path,
    scopes,
    serviceEnvironment: serviceConfig.environment,
    serviceVersion: serviceConfig.version,
    supportChannel: config.get('supportChannel'),
    isProduction: config.get('isProduction'),
    isTest: config.get('isTest')
  }
}
