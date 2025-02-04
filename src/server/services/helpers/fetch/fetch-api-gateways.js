import { config } from '~/src/config/config.js'
import { fetcher } from '~/src/server/common/helpers/fetch/fetcher.js'

async function fetchApiGateways(serviceName, logger) {
  try {
    const endpoint =
      config.get('portalBackendUrl') + `/api-gateways/${serviceName}`
    const { data } = await fetcher(endpoint)

    return data
  } catch (error) {
    logger.debug(error, 'No api gateways found')
    return null
  }
}

export { fetchApiGateways }
