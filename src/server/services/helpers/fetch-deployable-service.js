import fetch from 'node-fetch'
import Boom from '@hapi/boom'
import { isNull } from 'lodash'

import { config } from '~/src/config'

async function fetchDeployableService(serviceId) {
  const serviceEndpointUrl =
    config.get('portalBackendApiUrl') + `/services/${serviceId}`

  const response = await fetch(serviceEndpointUrl, {
    method: 'get',
    headers: { 'Content-Type': 'application/json' }
  })

  // TODO update API endpoint to return a 404 if not found. At the moment it returns null
  // TODO would also be good to have deployable return in the same way as other endpoints
  const json = await response.json()

  if (response.status === 204 || response.status === 404 || isNull(json)) {
    throw Boom.boomify(Boom.notFound())
  }

  if (response.ok) {
    return json
  }

  throw Boom.boomify(new Error(json.message), { statusCode: response.status })
}

export { fetchDeployableService }
