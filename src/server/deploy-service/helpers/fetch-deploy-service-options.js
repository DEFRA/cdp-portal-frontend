import Boom from '@hapi/boom'
import fetch from 'node-fetch'

import { config } from '~/src/config'

async function fetchDeployServiceOptions() {
  const deployServiceOptionsEndpoint =
    config.get('selfServiceOpsApiUrl') + '/deploy-service/options'

  const response = await fetch(deployServiceOptionsEndpoint, {
    method: 'get',
    headers: { 'Content-Type': 'application/json' }
  })
  const json = await response.json()

  if (response.ok) {
    return json
  }

  throw Boom.boomify(new Error(json.message), { statusCode: response.status })
}

export { fetchDeployServiceOptions }
