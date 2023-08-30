import Boom from '@hapi/boom'
import fetch from 'node-fetch'

import { appConfig } from '~/src/config'

async function fetchLibrary(libraryId) {
  const libraryEndpointUrl =
    appConfig.get('teamsAndRepositoriesApiUrl') + `/libraries/${libraryId}`

  const response = await fetch(libraryEndpointUrl, {
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

  throw Error(json.message)
}

export { fetchLibrary }
