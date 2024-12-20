import Boom from '@hapi/boom'

import { config } from '~/src/config/config.js'
import { fetcher } from '~/src/server/common/helpers/fetch/fetcher.js'

// Portal Backend returns empty array for not found deployments
function checkDeployment(data) {
  if (data?.length === 0) {
    throw Boom.boomify(Boom.notFound())
  }

  return data
}

async function fetchDeployment(deploymentId) {
  try {
    const endpoint =
      config.get('portalBackendUrl') + `/v2/deployments/${deploymentId}`

    const { data } = await fetcher(endpoint)
    return checkDeployment(data)
  } catch (error) {
    if (error.output.statusCode === 404) {
      throw Boom.boomify(Boom.notFound())
    }

    throw error
  }
}

export { fetchDeployment }
