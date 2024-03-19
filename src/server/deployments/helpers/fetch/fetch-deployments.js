import qs from 'qs'

import { config } from '~/src/config'
import { fetcher } from '~/src/server/common/helpers/fetch/fetcher'

async function fetchDeployments(environment, queryParams) {
  const queryString = qs.stringify(queryParams)

  const endpoint =
    config.get('portalBackendApiUrl') +
    `/v2/deployments?environment=${environment}${
      queryString ? `&${queryString}` : ''
    }`

  const { json } = await fetcher(endpoint)
  return json
}

export { fetchDeployments }
