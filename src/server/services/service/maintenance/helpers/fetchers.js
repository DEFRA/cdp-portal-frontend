import { config } from '../../../../../config/config.js'
import { removeNil } from '../../../../common/helpers/remove-nil.js'

const selfServiceOpsUrl = config.get('selfServiceOpsUrl')

async function requestShutterUpdate(request, details, shouldShutter) {
  const endpoint = `${selfServiceOpsUrl}/${shouldShutter ? 'shutter-url' : 'unshutter-url'}`

  const { payload } = await request.authedFetchJson(endpoint, {
    method: 'post',
    payload: removeNil(details)
  })
  return payload
}

async function requestUndeploy(request, details) {
  const endpoint = `${selfServiceOpsUrl}/deploy-service/to-zero/${details.environment}/${details.serviceName}`

  const { payload } = await request.authedFetchJson(endpoint, {
    method: 'POST'
  })
  return payload
}

export { requestShutterUpdate, requestUndeploy }
