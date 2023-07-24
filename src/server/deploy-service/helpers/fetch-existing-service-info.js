import fetch from 'node-fetch'

import { appConfig } from '~/src/config'

async function fetchExistingServiceInfo(environment, imageName) {
  const existingServiceInfoEndpoint = `${appConfig.get(
    'selfServiceOpsApiUrl'
  )}/deploy-service/info/${environment}/${imageName}`

  const response = await fetch(existingServiceInfoEndpoint)

  return await response.json()
}

export { fetchExistingServiceInfo }
