import { config } from '~/src/config/config.js'
import { removeNil } from '~/src/server/common/helpers/remove-nil.js'

const selfServiceOpsUrl = config.get('selfServiceOpsUrl')

function requestShutterUpdate(request, details, shouldShutter) {
  const endpoint = `${selfServiceOpsUrl}/${shouldShutter ? 'shutter-url' : 'unshutter-url'}`

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

function requestUndeploy(request, details) {
  const endpoint = `${selfServiceOpsUrl}/deploy-service/to-zero/${details.environment}/${details.serviceName}`

  return request.authedFetchJson(endpoint, {
    method: 'POST'
  })
}

export { requestShutterUpdate, requestUndeploy }
