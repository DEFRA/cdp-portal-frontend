import { config } from '~/src/config/index.js'
import { fetcher } from '~/src/server/common/helpers/fetch/fetcher.js'

async function fetchVanityUrls(serviceName, logger) {
  try {
    const endpoint = `${config.get('portalBackendUrl')}/vanity-urls/${serviceName}`
    const { data } = await fetcher(endpoint, {}, false)
    logger.info(data)
    return data
  } catch (error) {
    logger.debug(error, 'No vanity urls found')
    return {}
  }
}

export { fetchVanityUrls }
