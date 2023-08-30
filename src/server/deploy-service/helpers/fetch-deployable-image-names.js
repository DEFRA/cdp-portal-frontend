import fetch from 'node-fetch'

import { appConfig } from '~/src/config'

async function fetchDeployableImageNames() {
  const deployableImagesEndpointUrl =
    appConfig.get('portalBackendApiUrl') + '/deployables'

  const response = await fetch(deployableImagesEndpointUrl, {
    method: 'get',
    headers: { 'Content-Type': 'application/json' }
  })
  const json = await response.json()

  if (response.ok) {
    return json
  }

  throw Error(json.message)
}

export { fetchDeployableImageNames }
