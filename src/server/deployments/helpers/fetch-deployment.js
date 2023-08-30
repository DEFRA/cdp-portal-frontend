import fetch from 'node-fetch'
import Boom from '@hapi/boom'

import { appConfig } from '~/src/config'

async function fetchDeployment(deploymentId) {
  const deploymentEndpointUrl =
    appConfig.get('portalBackendApiUrl') + `/deployments/${deploymentId}`

  const response = await fetch(deploymentEndpointUrl, {
    method: 'get',
    headers: { 'Content-Type': 'application/json' }
  })
  const json = await response.json()

  if (response.status === 404) {
    throw Boom.boomify(Boom.notFound())
  }

  if (response.ok) {
    return json
  }

  throw Error(json.message)
}

export { fetchDeployment }
