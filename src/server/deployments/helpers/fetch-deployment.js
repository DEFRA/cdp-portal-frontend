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

  if (response.status === 404) {
    throw Boom.boomify(Boom.notFound())
  }

  if (response.ok) {
    return json
  }

  throw Boom.boomify(new Error(json.message), { statusCode: response.status })
}

export { fetchDeployment }
