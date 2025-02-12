import { config } from '~/src/config/config.js'

const selfServiceOpsUrl = config.get('selfServiceOpsUrl')

export function scaleEcsToZero(request, serviceName) {
  const endpoint = `${selfServiceOpsUrl}/scale-to-zero/${serviceName}`

  return request.authedFetchJson(endpoint, {
    method: 'post',
    headers: { 'Content-Type': 'application/json' }
  })
}
