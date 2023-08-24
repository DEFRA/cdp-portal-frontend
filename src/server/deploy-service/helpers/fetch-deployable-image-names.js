import fetch from 'node-fetch'

import { appConfig } from '~/src/config'

async function fetchDeployableImageNames() {
  const deployableImagesEndpointUrl = `${appConfig.get(
    'portalBackendApiUrl'
  )}/deployables`

  const response = await fetch(deployableImagesEndpointUrl)

  return await response.json()
}

export { fetchDeployableImageNames }
