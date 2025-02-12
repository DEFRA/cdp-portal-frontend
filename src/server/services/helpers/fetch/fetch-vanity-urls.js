import { config } from '~/src/config/config.js'
import { fetcher } from '~/src/server/common/helpers/fetch/fetcher.js'

async function fetchVanityUrls(serviceName, logger) {
  const endpoint =
    config.get('portalBackendUrl') + `/vanity-urls/${serviceName}`

  try {
    const { payload } = await fetcher(endpoint)
    return payload
  } catch (error) {
    logger.debug(error, 'No vanity urls found')
    return null
  }
}

export { fetchVanityUrls }
