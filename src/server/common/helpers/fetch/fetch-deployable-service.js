import Boom from '@hapi/boom'

import { config } from '~/src/config/index.js'
import { fetcher } from '~/src/server/common/helpers/fetch/fetcher.js'

async function fetchDeployableService(serviceId) {
  try {
    const endpoint = config.get('portalBackendUrl') + `/services/${serviceId}`

    const { data } = await fetcher(endpoint)
    return data
  } catch (error) {
    const statusCode = error.output.statusCode

    if (statusCode === 204 || statusCode === 404) {
      throw Boom.boomify(Boom.notFound())
    }

    throw error
  }
}

export { fetchDeployableService }
