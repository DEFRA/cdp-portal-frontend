import Boom from '@hapi/boom'

import { config } from '~/src/config'
import { fetcher } from '~/src/server/common/helpers/fetch/fetcher'

function checkLibrary(json) {
  if (json?.libraries?.length === 0) {
    throw Boom.boomify(Boom.notFound())
  }

  return json
}

async function fetchLibrary(libraryId) {
  try {
    const endpoint = config.get('portalBackendUrl') + `/libraries/${libraryId}`
    const { json } = await fetcher(endpoint)

    return checkLibrary(json)
  } catch (error) {
    if (error.output.statusCode === 404) {
      throw Boom.boomify(Boom.notFound())
    }
    throw error
  }
}

export { fetchLibrary }
