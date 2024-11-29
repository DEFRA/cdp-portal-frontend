import qs from 'qs'

import { config } from '~/src/config/index.js'
import { fetcher } from '~/src/server/common/helpers/fetch/fetcher.js'

async function fetchRunningServices(environments) {
  const endpoint =
    config.get('portalBackendUrl') +
    '/v2/whats-running-where' +
    qs.stringify(
      { environments },
      { arrayFormat: 'repeat', addQueryPrefix: true }
    )

  const { data } = await fetcher(endpoint)
  return data
}

export { fetchRunningServices }
