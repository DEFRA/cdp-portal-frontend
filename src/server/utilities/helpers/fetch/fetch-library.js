import Boom from '@hapi/boom'

import { config } from '~/src/config'
import { fetcher } from '~/src/server/common/helpers/fetch/fetcher'

async function fetchLibrary(libraryId) {
  const endpoint = config.get('portalBackendApiUrl') + `/libraries/${libraryId}`

  const { json, response } = await fetcher(endpoint)

  if (response.status === 404 || json?.libraries?.length === 0) {
    throw Boom.boomify(Boom.notFound())
  }

  return json
}

export { fetchLibrary }
