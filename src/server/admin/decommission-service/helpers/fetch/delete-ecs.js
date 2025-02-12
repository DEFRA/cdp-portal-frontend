import { config } from '~/src/config/config.js'

const selfServiceOpsUrl = config.get('selfServiceOpsUrl')

export function deleteEcs(request, serviceName) {
  const endpoint = `${selfServiceOpsUrl}/delete-ecs/${serviceName}`

  return request.authedFetcher(endpoint, {
    method: 'DELETE',
    headers: { 'Content-Type': 'application/json' }
  })
}
