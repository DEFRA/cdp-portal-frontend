import qs from 'qs'
import fetch from 'node-fetch'
import Boom from '@hapi/boom'

import { config } from '~/src/config'

async function fetchDeployments(environment, queryParams) {
  const queryString = qs.stringify(queryParams)

  const deploymentsEndpointUrl =
    config.get('portalBackendApiUrl') +
    `/squashed-deployments?environment=${environment}${
      queryString ? `&${queryString}` : ''
    }`

  const response = await fetch(deploymentsEndpointUrl, {
    method: 'get',
    headers: { 'Content-Type': 'application/json' }
  })
  const json = await response.json()

  if (response.ok) {
    return json
  }

  throw Boom.boomify(new Error(json.message), { statusCode: response.status })
}

export { fetchDeployments }
