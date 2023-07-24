import fetch from 'node-fetch'

import { appConfig } from '~/src/config'

async function fetchDeployServiceOptions() {
  const deployServiceOptionsEndpoint = `${appConfig.get(
    'selfServiceOpsApiUrl'
  )}/deploy-service/options`

  const response = await fetch(deployServiceOptionsEndpoint)

  return await response.json()
}

export { fetchDeployServiceOptions }
