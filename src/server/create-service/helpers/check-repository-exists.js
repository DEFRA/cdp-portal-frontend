import fetch from 'node-fetch'

import { config } from '~/src/config'

async function checkRepositoryExists(repositoryName) {
  const createServiceStatusEndpointUrl = `${config.get(
    'portalBackendApiUrl'
  )}/repositories/${repositoryName}`

  const response = await fetch(createServiceStatusEndpointUrl, {
    method: 'get',
    headers: { 'Content-Type': 'application/json' }
  })

  return response.ok
}

export { checkRepositoryExists }
