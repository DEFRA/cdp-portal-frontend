import Boom from '@hapi/boom'

import { config } from '~/src/config'
import { fetcher } from '~/src/server/common/helpers/fetch/fetcher'

async function fetchDeployableService(serviceId) {
  try {
    const endpoint =
      config.get('portalBackendApiUrl') + `/services/${serviceId}`

    const { json } = await fetcher(endpoint)
    return json
  } catch (error) {
    const statusCode = error.output.statusCode

    if (statusCode === 204 || statusCode === 404) {
      throw Boom.boomify(Boom.notFound())
    }

    throw error
  }
}

export { fetchDeployableService }
