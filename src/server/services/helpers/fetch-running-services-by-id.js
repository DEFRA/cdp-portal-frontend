import Boom from '@hapi/boom'
import fetch from 'node-fetch'

import { config } from '~/src/config'

async function fetchRunningServicesById(serviceId) {
  const runningServices =
    config.get('portalBackendApiUrl') + `/whats-running-where/${serviceId}`

  const response = await fetch(runningServices, {
    method: 'get',
    headers: { 'Content-Type': 'application/json' }
  })
  const json = await response.json()

  if (response.ok) {
    return json
  }

  throw Boom.boomify(new Error(json.message), { statusCode: response.status })
}

export { fetchRunningServicesById }
