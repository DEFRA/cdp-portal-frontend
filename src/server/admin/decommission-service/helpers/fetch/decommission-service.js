import { config } from '~/src/config/config.js'

const selfServiceOpsUrl = config.get('selfServiceOpsUrl')

export function decommissionService(request, serviceName) {
  const endpoint = `${selfServiceOpsUrl}/decommission/${serviceName}`

  return request.authedFetcher(endpoint, {
    method: 'delete',
    headers: { 'Content-Type': 'application/json' }
  })
}
