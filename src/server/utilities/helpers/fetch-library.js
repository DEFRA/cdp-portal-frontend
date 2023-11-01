import Boom from '@hapi/boom'
import fetch from 'node-fetch'

import { config } from '~/src/config'

async function fetchLibrary(libraryId) {
  const libraryEndpointUrl =
    config.get('portalBackendApiUrl') + `/libraries/${libraryId}`

  const response = await fetch(libraryEndpointUrl, {
    method: 'get',
    headers: { 'Content-Type': 'application/json' }
  })
  const json = await response.json()

  if (response.status === 404 || json?.libraries?.length === 0) {
    throw Boom.boomify(Boom.notFound())
  }

  if (response.ok) {
    return json
  }

  throw Boom.boomify(new Error(json.message), { statusCode: response.status })
}

export { fetchLibrary }
