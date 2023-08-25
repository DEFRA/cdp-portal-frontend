import fetch from 'node-fetch'

import { appConfig } from '~/src/config'

async function fetchDeployServiceOptions() {
  const deployServiceOptionsEndpoint =
    appConfig.get('selfServiceOpsApiUrl') + '/deploy-service/options'

  const response = await fetch(deployServiceOptionsEndpoint, {
    method: 'get',
    headers: { 'Content-Type': 'application/json' }
  })
  const json = await response.json()

  if (response.ok) {
    return json
  }

  throw Error(json.message)
}

export { fetchDeployServiceOptions }
