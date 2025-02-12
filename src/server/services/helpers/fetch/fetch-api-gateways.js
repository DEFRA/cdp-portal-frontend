import { config } from '~/src/config/config.js'
import { fetchJson } from '~/src/server/common/helpers/fetch/fetch-json.js'

async function fetchApiGateways(serviceName, logger) {
  const endpoint =
    config.get('portalBackendUrl') + `/api-gateways/${serviceName}`

  try {
    const { payload } = await fetchJson(endpoint)
    return payload
  } catch (error) {
    logger.debug(error, 'No api gateways found')
    return null
  }
}

export { fetchApiGateways }
