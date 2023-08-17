import fetch from 'node-fetch'
import Boom from '@hapi/boom'

import { appConfig } from '~/src/config'

async function fetchDeployment(deploymentId) {
  const deploymentEndpointUrl = `${appConfig.get(
    'portalBackendApiUrl'
  )}/deployments/${deploymentId}`

  const response = await fetch(deploymentEndpointUrl)

  if (response.status === 404) {
    throw Boom.boomify(Boom.notFound())
  }

  return await response.json()
}

export { fetchDeployment }
