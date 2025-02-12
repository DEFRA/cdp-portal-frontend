import qs from 'qs'

import { config } from '~/src/config/config.js'
import { fetcher } from '~/src/server/common/helpers/fetch/fetcher.js'

async function fetchRunningServices(environments, queryParams = {}) {
  const endpoint =
    config.get('portalBackendUrl') +
    '/v2/whats-running-where' +
    qs.stringify(
      { environments, ...queryParams },
      { arrayFormat: 'repeat', addQueryPrefix: true }
    )

  const { payload } = await fetcher(endpoint)
  return payload
}

export { fetchRunningServices }
