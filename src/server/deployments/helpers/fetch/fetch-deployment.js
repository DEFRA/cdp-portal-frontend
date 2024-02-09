import Boom from '@hapi/boom'

import { config } from '~/src/config'
import { fetcher } from '~/src/server/common/helpers/fetch/fetcher'

async function fetchDeployment(deploymentId) {
  const endpoint =
    config.get('portalBackendApiUrl') + `/deployments/${deploymentId}`

  const { json, response } = await fetcher(endpoint)

  // Portal Backend returns empty array for not found deployments
  if (response.status === 404 || json?.length === 0) {
    throw Boom.boomify(Boom.notFound())
  }

  return json
}

export { fetchDeployment }
