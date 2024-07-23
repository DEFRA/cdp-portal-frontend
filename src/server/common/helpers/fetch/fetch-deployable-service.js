import Boom from '@hapi/boom'

import { config } from '~/src/config'
import { fetcher } from '~/src/server/common/helpers/fetch/fetcher'
import { isNull } from 'lodash'
import { throwHttpError } from '~/src/server/common/helpers/fetch/throw-http-error'

async function fetchDeployableService(serviceId) {
  try {
    const endpoint =
      config.get('portalBackendApiUrl') + `/services/${serviceId}`

    const { json } = await fetcher(endpoint)

    if (isNull(json)) {
      throwHttpError(null, { status: 404 })
    }

    return json
  } catch (error) {
    const statusCode = error.output.statusCode

    if (statusCode === 204 || statusCode === 404) {
      throw Boom.boomify(Boom.notFound())
    }

    return {}
  }
}

export { fetchDeployableService }
