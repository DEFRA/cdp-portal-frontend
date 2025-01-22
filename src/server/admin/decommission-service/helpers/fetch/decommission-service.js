import { config } from '~/src/config/config.js'

const selfServiceOpsUrl = config.get('selfServiceOpsUrl')

export async function decommissionService(request, serviceName) {
  const endpoint = `${selfServiceOpsUrl}/decommission/${serviceName}`

  const { response } = await request.authedFetcher(endpoint, {
    method: 'DELETE',
    headers: { 'Content-Type': 'application/json' }
  })

  return { response }
}
