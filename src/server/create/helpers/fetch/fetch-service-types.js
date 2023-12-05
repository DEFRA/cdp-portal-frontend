import Boom from '@hapi/boom'
import fetch from 'node-fetch'

import { config } from '~/src/config'

async function fetchServiceTypes() {
  const serviceTypesEndpointUrl =
    config.get('portalBackendApiUrl') + '/service-types'

  const response = await fetch(serviceTypesEndpointUrl, {
    method: 'get',
    headers: { 'Content-Type': 'application/json' }
  })
  const json = await response.json()

  if (response.ok) {
    return json
  }

  throw Boom.boomify(new Error(json.message), { statusCode: response.status })
}

export { fetchServiceTypes }
