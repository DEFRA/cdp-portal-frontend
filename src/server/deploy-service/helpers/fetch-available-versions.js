import Boom from '@hapi/boom'

import { config } from '~/src/config'

async function fetchAvailableVersions(serviceName, request) {
  const deployablesVersionsEndpoint =
    config.get('portalBackendApiUrl') + `/deployables/${serviceName}`

  const response = await request.fetchWithAuth(deployablesVersionsEndpoint, {
    method: 'get',
    headers: { 'Content-Type': 'application/json' }
  })
  const json = await response.json()

  if (response.ok) {
    return json.filter((version) => version !== '0.0.0')
  }

  throw Boom.boomify(new Error(json.message), { statusCode: response.status })
}

export { fetchAvailableVersions }
