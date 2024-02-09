import Boom from '@hapi/boom'

import { config } from '~/src/config'

async function fetchEnvironments(request) {
  const environmentsEndpointUrl =
    config.get('portalBackendApiUrl') + '/environments'

  const response = await request.authedFetcher(environmentsEndpointUrl, {
    method: 'get',
    headers: { 'Content-Type': 'application/json' }
  })
  const json = await response.json()

  if (response.ok) {
    return json
  }

  throw Boom.boomify(new Error(json.message), { statusCode: response.status })
}

export { fetchEnvironments }
