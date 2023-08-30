import fetch from 'node-fetch'

import { appConfig } from '~/src/config'

async function fetchServiceTypes() {
  const serviceTypesEndpointUrl =
    appConfig.get('teamsAndRepositoriesApiUrl') + '/service-types'

  const response = await fetch(serviceTypesEndpointUrl, {
    method: 'get',
    headers: { 'Content-Type': 'application/json' }
  })
  const json = await response.json()

  if (response.ok) {
    return json
  }

  throw Error(json.message)
}

export { fetchServiceTypes }
