import Boom from '@hapi/boom'

import { config } from '../../../../config/config.js'
import { fetchJson } from '../../../common/helpers/fetch/fetch-json.js'
import { createLogger } from '../../../common/helpers/logging/logger.js'

const logger = createLogger()

async function fetchDeployment(deploymentId) {
  const endpoint =
    config.get('portalBackendUrl') + `/deployments/${deploymentId}`

  try {
    const { payload } = await fetchJson(endpoint)
    return payload
  } catch (error) {
    logger.debug(error, 'Deployment error')

    if (error.output.statusCode === 404) {
      throw Boom.boomify(Boom.notFound())
    }

    return null
  }
}

export { fetchDeployment }
