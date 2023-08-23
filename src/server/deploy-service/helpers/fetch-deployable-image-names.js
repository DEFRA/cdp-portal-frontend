import fetch from 'node-fetch'

import { appConfig } from '~/src/config'

// TODO move this into the pre?
async function fetchDeployableImageNames() {
  const deployableImagesEndpointUrl = `${appConfig.get(
    'portalBackendApiUrl'
  )}/deployables`

  const response = await fetch(deployableImagesEndpointUrl)

  return await response.json()
}

export { fetchDeployableImageNames }
