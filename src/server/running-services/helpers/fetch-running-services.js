import fetch from 'node-fetch'
import Boom from '@hapi/boom'

import { config } from '~/src/config'

async function fetchRunningServices() {
  const runningServicesEndpointUrl =
    config.get('portalBackendApiUrl') + '/whats-running-where'

  const response = await fetch(runningServicesEndpointUrl, {
    method: 'get',
    headers: { 'Content-Type': 'application/json' }
  })
  const json = await response.json()

  if (response.ok) {
    return json
  }

  throw Boom.boomify(new Error(json.message), { statusCode: response.status })
}

export { fetchRunningServices }
