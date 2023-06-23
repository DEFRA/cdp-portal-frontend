import Boom from '@hapi/boom'
import fetch from 'node-fetch'

import { appConfig } from '~/src/config'

async function fetchLibrary(libraryId) {
  const libraryEndpointUrl = `${appConfig.get(
    'teamsAndRepositoriesApiUrl'
  )}/libraries/${libraryId}`

  const response = await fetch(libraryEndpointUrl)

  if (response.status === 404) {
    throw Boom.boomify(Boom.notFound())
  }

  return await response.json()
}

export { fetchLibrary }
