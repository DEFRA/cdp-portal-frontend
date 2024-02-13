import Boom from '@hapi/boom'
import fetch from 'node-fetch'

import { config } from '~/src/config'

async function fetchExistingServiceInfo(environment, imageName) {
  const existingServiceInfoEndpoint =
    config.get('selfServiceOpsApiUrl') +
    `/deploy-service/info/${environment}/${imageName}`

  const response = await fetch(existingServiceInfoEndpoint, {
    method: 'get',
    headers: { 'Content-Type': 'application/json' }
  })

  const json = await response.json()

  if (response.ok) {
    return json
  }

  if (response.status === 404) {
    return null
  }

  throw Boom.boomify(new Error(json.message), { statusCode: response.status })
}

export { fetchExistingServiceInfo }
