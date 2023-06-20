import fetch from 'node-fetch'
import Boom from '@hapi/boom'

import { appConfig } from '~/src/config'

async function fetchDeployableService(serviceId) {
  const serviceEndpointUrl = `${appConfig.get(
    'deployablesV1ApiUrl'
  )}/services/${serviceId}`

  const response = await fetch(serviceEndpointUrl)

  if (response.status === 204) {
    throw Boom.boomify(Boom.notFound())
  }

  return await response.json()
}

export { fetchDeployableService }
