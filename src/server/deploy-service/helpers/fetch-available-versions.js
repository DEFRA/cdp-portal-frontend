import fetch from 'node-fetch'

import { appConfig } from '~/src/config'
import Boom from '@hapi/boom'

async function fetchAvailableVersions(serviceName) {
  const deployablesVersionsEndpoint =
    appConfig.get('portalBackendApiUrl') + `/deployables/${serviceName}`

  const response = await fetch(deployablesVersionsEndpoint, {
    method: 'get',
    headers: { 'Content-Type': 'application/json' }
  })
  const json = await response.json()

  if (response.ok) {
    return json
  }

  throw Boom.boomify(new Error(json.message), { statusCode: response.status })
}

export { fetchAvailableVersions }
