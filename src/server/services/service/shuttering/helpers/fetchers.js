import { config } from '~/src/config/config.js'
import { fetchJson } from '~/src/server/common/helpers/fetch/fetch-json.js'
import { removeNil } from '~/src/server/common/helpers/remove-nil.js'
import { createLogger } from '~/src/server/common/helpers/logging/logger.js'

const logger = createLogger()
const portalBackendUrl = config.get('portalBackendUrl')
const selfServiceOpsUrl = config.get('selfServiceOpsUrl')

function requestShutterUpdate(request, details) {
  const endpoint = `${selfServiceOpsUrl}/shutter/${details.serviceName}`

  return request.authedFetchJson(endpoint, {
    method: 'post',
    payload: removeNil({
      serviceName: details.serviceName,
      environment: details.environment,
      waf: details.waf,
      url: details.url
    })
  })
}

export { requestShutterUpdate }
