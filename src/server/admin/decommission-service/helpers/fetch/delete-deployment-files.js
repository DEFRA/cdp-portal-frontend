import { config } from '~/src/config/config.js'

const selfServiceOpsUrl = config.get('selfServiceOpsUrl')

export function deleteDeploymentFiles(request, serviceName) {
  const endpoint = `${selfServiceOpsUrl}/delete-deployment-files/${serviceName}`

  return request.authedFetcher(endpoint, {
    method: 'DELETE',
    headers: { 'Content-Type': 'application/json' }
  })
}
