import qs from 'qs'
import fetch from 'node-fetch'
import Boom from '@hapi/boom'

import { appConfig } from '~/src/config'
import { isNil } from 'lodash'

async function fetchDeployments(environment, auth, queryParams) {
  const queryString = qs.stringify(queryParams)

  const deploymentsEndpointUrl =
    appConfig.get('portalBackendApiUrl') +
    `/deployments?environment=${environment}${
      queryString ? `&${queryString}` : ''
    }`

  const headers = { 'Content-Type': 'application/json' }
  const token = auth?.credentials?.token

  if (!isNil(token)) {
    headers.Authorization = `Bearer ${token}`
  }

  const response = await fetch(deploymentsEndpointUrl, {
    method: 'get',
    headers
  })
  const json = await response.json()

  if (response.ok) {
    return json
  }

  throw Boom.boomify(new Error(json.message), { statusCode: response.status })
}

export { fetchDeployments }
