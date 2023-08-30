import qs from 'qs'
import fetch from 'node-fetch'

import { appConfig } from '~/src/config'

async function fetchDeployments(environment, queryParams) {
  const queryString = qs.stringify(queryParams)

  const deploymentsEndpointUrl =
    appConfig.get('portalBackendApiUrl') +
    `/deployments?environment=${environment}${
      queryString ? `&${queryString}` : ''
    }`

  const response = await fetch(deploymentsEndpointUrl, {
    method: 'get',
    headers: { 'Content-Type': 'application/json' }
  })
  const json = await response.json()

  if (response.ok) {
    return json
  }

  throw Error(json.message)
}

export { fetchDeployments }
