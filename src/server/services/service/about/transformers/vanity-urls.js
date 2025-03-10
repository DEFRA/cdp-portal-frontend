import { fetchVanityUrls } from '~/src/server/services/helpers/fetch/fetch-vanity-urls.js'
import { sortKeyByEnv } from '~/src/server/common/helpers/sort/sort-by-env.js'

/**
 * @typedef {object} VanityUrl
 * @property {string} environment
 * @property {Array<string>} urls
 */

/**
 * Construct vanity url array of objects, for use in the template
 * @param {import('@hapi/hapi').Request} request
 * @returns {Promise<{VanityUrl}[]|null>}
 */
async function provideVanityUrls(request) {
  const urls = await fetchVanityUrls(request.params?.serviceId, request.logger)

  if (urls) {
    return Object.entries(urls)
      .map(([environment, { vanityUrls }]) => ({
        environment,
        urls: vanityUrls
      }))
      .sort(sortKeyByEnv('environment'))
  }

  return null
}

export { provideVanityUrls }
