import fetch from 'node-fetch'

import { appConfig } from '~/src/config'

async function fetchRunningServices() {
  const runningServicesEndpointUrl =
    appConfig.get('portalBackendApiUrl') + '/whats-running-where'

  const response = await fetch(runningServicesEndpointUrl, {
    method: 'get',
    headers: { 'Content-Type': 'application/json' }
  })
  const json = await response.json()

  if (response.ok) {
    return json
  }

  throw Error(json.message)
}

export { fetchRunningServices }
