import Boom from '@hapi/boom'

import { config } from '~/src/config'
import { fetcher } from '~/src/server/common/helpers/fetch/fetcher'

// Portal Backend returns empty array for not found deployments
function checkDeployment(json) {
  if (json?.length === 0) {
    throw Boom.boomify(Boom.notFound())
  }

  return json
}

async function fetchDeployment(deploymentId) {
  try {
    const endpoint =
      config.get('portalBackendApiUrl') + `/v2/deployments/${deploymentId}`

    const { json } = await fetcher(endpoint)
    return checkDeployment(json)
  } catch (error) {
    if (error.output.statusCode === 404) {
      throw Boom.boomify(Boom.notFound())
    }

    throw error
  }
}

export { fetchDeployment }
