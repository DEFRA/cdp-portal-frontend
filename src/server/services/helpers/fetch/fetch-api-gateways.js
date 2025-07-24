import { config } from '../../../../config/config.js'
import { fetchJson } from '../../../common/helpers/fetch/fetch-json.js'

async function fetchApiGateways(serviceName, logger) {
  const endpoint =
    config.get('portalBackendUrl') + `/api-gateways/${serviceName}`

  try {
    const { payload } = await fetchJson(endpoint)
    return payload
  } catch (error) {
    logger.debug('No api gateways found')
    return null
  }
}

export { fetchApiGateways }
