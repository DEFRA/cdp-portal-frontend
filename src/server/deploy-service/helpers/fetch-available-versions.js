import fetch from 'node-fetch'

import { appConfig } from '~/src/config'

async function fetchAvailableVersions(serviceName) {
  // TODO fix up deployables API. At the moment if no serviceName is provided then it returns /deployables endpoint JSON
  if (!serviceName) {
    return []
  }

  const deployablesVersionsEndpoint =
    appConfig.get('deployablesApiUrl') + `/deployables/${serviceName}`

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
