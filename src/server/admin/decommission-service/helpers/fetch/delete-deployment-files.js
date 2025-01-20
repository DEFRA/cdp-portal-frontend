import { config } from '~/src/config/config.js'

const selfServiceOpsUrl = config.get('selfServiceOpsUrl')

export async function deleteDeploymentFiles(request, serviceName) {
  const endpoint = `${selfServiceOpsUrl}/delete-deployment-files/${serviceName}`

  const { response } = await request.authedFetcher(endpoint, {
    method: 'DELETE',
    headers: { 'Content-Type': 'application/json' }
  })

  return response
}
