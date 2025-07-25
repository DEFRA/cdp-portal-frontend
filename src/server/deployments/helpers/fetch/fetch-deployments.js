import qs from 'qs'

import { config } from '../../../../config/config.js'
import { fetchJson } from '../../../common/helpers/fetch/fetch-json.js'

async function fetchDeployments(environment, queryParams) {
  const queryString = qs.stringify(queryParams, { arrayFormat: 'repeat' })
  const endpoint =
    config.get('portalBackendUrl') +
    `/deployments?environment=${environment}${
      queryString ? `&${queryString}` : ''
    }`

  const { payload } = await fetchJson(endpoint)
  return payload
}

export { fetchDeployments }
