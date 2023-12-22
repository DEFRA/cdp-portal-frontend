import Boom from '@hapi/boom'
import fetch from 'node-fetch'

import { config } from '~/src/config'

async function fetchRepository(repositoryId) {
  const repositoryEndpointUrl =
    config.get('portalBackendApiUrl') + `/repositories/${repositoryId}`

  const response = await fetch(repositoryEndpointUrl, {
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

export { fetchRepository }
