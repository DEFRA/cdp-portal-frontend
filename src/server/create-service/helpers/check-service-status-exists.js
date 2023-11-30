import fetch from 'node-fetch'

import { config } from '~/src/config'

async function checkServiceStatusExists(repositoryName) {
  const createServiceStatusEndpointUrl = `${config.get(
    'selfServiceOpsApiUrl'
  )}/create-service/status/${repositoryName}`

  const response = await fetch(createServiceStatusEndpointUrl, {
    method: 'get',
    headers: { 'Content-Type': 'application/json' }
  })

  return response.ok
}

export { checkServiceStatusExists }
