import Boom from '@hapi/boom'

import { config } from '~/src/config'

async function fetchDeployableImageNames(request) {
  const deployableImagesEndpointUrl =
    config.get('portalBackendApiUrl') + '/deployables'

  const response = await request.fetchWithAuth(deployableImagesEndpointUrl, {
    method: 'get',
    headers: { 'Content-Type': 'application/json' }
  })
  const json = await response.json()

  if (response.ok) {
    return json
  }

  throw Boom.boomify(new Error(json.message), { statusCode: response.status })
}

export { fetchDeployableImageNames }
