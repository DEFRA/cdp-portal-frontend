import fetch from 'node-fetch'
import Boom from '@hapi/boom'

import { config } from '~/src/config'

async function fetchDeployment(deploymentId) {
  const deploymentEndpointUrl =
    config.get('portalBackendApiUrl') + `/deployments/${deploymentId}`

  const response = await fetch(deploymentEndpointUrl, {
    method: 'get',
    headers: { 'Content-Type': 'application/json' }
  })
  const json = await response.json()

  // Portal Backend returns empty array for not found deployments
  if (response.status === 404 || json?.length === 0) {
    throw Boom.boomify(Boom.notFound())
  }

  if (response.ok) {
    return json
  }

  throw Boom.boomify(new Error(json.message), { statusCode: response.status })
}

export { fetchDeployment }
