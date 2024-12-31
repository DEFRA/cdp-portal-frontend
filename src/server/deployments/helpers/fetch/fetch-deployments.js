import qs from 'qs'

import { config } from '~/src/config/config.js'
import { fetcher } from '~/src/server/common/helpers/fetch/fetcher.js'

async function fetchDeployments(environment, queryParams) {
  const queryString = qs.stringify(queryParams)
  const endpoint =
    config.get('portalBackendUrl') +
    `/v2/deployments?environment=${environment}${
      queryString ? `&${queryString}` : ''
    }`

  const { data } = await fetcher(endpoint)
  return data
}

export { fetchDeployments }
