import { config } from '~/src/config/config.js'
import { fetchJson } from '~/src/server/common/helpers/fetch/fetch-json.js'

async function fetchVanityUrls(serviceName, logger) {
  const endpoint =
    config.get('portalBackendUrl') + `/vanity-urls/${serviceName}`

  try {
    const { payload } = await fetchJson(endpoint)
    return payload
  } catch (error) {
    logger.debug(error, 'No vanity urls found')
    return null
  }
}

export { fetchVanityUrls }
