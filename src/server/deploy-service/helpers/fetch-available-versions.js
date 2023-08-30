import fetch from 'node-fetch'

import { appConfig } from '~/src/config'

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

  throw Error(json.message)
}

export { fetchAvailableVersions }
