import Boom from '@hapi/boom'

import { config } from '~/src/config/config.js'
import { fetchJson } from '~/src/server/common/helpers/fetch/fetch-json.js'

async function fetchDeployableService(serviceId) {
  try {
    const endpoint = config.get('portalBackendUrl') + `/services/${serviceId}`

    const { payload } = await fetchJson(endpoint)
    return payload
  } catch (error) {
    const statusCode = error.output.statusCode

    if (statusCode === 204 || statusCode === 404) {
      throw Boom.boomify(Boom.notFound())
    }

    throw error
  }
}

export { fetchDeployableService }
