import { config } from '../../../../config/config.js'
import { fetchJson } from '../../../common/helpers/fetch/fetch-json.js'

async function fetchVanityUrls(serviceName, logger) {
  const endpoint =
    config.get('portalBackendUrl') + `/vanity-urls/${serviceName}`

  try {
    const { payload } = await fetchJson(endpoint)
    return payload
  } catch (error) {
    logger.debug('No vanity urls found')
    return null
  }
}

export { fetchVanityUrls }
