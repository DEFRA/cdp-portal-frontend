import qs from 'qs'

import { config } from '~/src/config/config.js'
import { fetchJson } from '~/src/server/common/helpers/fetch/fetch-json.js'

async function fetchDeployments(environment, queryParams) {
  const queryString = qs.stringify(queryParams, { arrayFormat: 'repeat' })
  const endpoint =
    config.get('portalBackendUrl') +
    `/v2/deployments?environment=${environment}${
      queryString ? `&${queryString}` : ''
    }`

  const { payload } = await fetchJson(endpoint)
  return payload
}

export { fetchDeployments }
