import Boom from '@hapi/boom'

import { config } from '~/src/config'
import { fetcher } from '~/src/server/common/helpers/fetch/fetcher'

async function fetchDeployableService(serviceId) {
  const endpoint = config.get('portalBackendApiUrl') + `/services/${serviceId}`

  const { json, response } = await fetcher(endpoint)

  if (response.status === 204 || response.status === 404) {
    throw Boom.boomify(Boom.notFound())
  }

  return json
}

export { fetchDeployableService }
