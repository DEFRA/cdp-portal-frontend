import Boom from '@hapi/boom'
import fetch from 'node-fetch'

import { config } from '~/src/config'

async function fetchDeployableImageNames() {
  const deployableImagesEndpointUrl =
    config.get('portalBackendApiUrl') + '/deployables'

  const response = await fetch(deployableImagesEndpointUrl, {
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
