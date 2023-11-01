import fetch from 'node-fetch'
import Boom from '@hapi/boom'

import { config } from '~/src/config'

async function fetchCreateServicesInProgressStatus() {
  const createServicesStatusEndpointUrl =
    config.get('selfServiceOpsApiUrl') + '/create-service/status'

  const response = await fetch(createServicesStatusEndpointUrl, {
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

export { fetchCreateServicesInProgressStatus }
