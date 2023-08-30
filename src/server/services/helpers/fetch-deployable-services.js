import fetch from 'node-fetch'

import { appConfig } from '~/src/config'

async function fetchDeployableServices() {
  const servicesEndpointUrl = `${appConfig.get('portalBackendApiUrl')}/services`

  const response = await fetch(servicesEndpointUrl, {
    method: 'get',
    headers: { 'Content-Type': 'application/json' }
  })
  const json = await response.json()

  if (response.ok) {
    return json
  }

  throw Error(json.message)
}

export { fetchDeployableServices }
