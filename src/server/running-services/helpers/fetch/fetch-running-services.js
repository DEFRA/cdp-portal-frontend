import qs from 'qs'

import { config } from '~/src/config/index.js'
import { fetcher } from '~/src/server/common/helpers/fetch/fetcher.js'

async function fetchRunningServices(environments) {
  const endpoint =
    config.get('portalBackendUrl') +
    '/v2/whats-running-where' +
    qs.stringify(
      { environments: Object.values(environments) },
      { arrayFormat: 'repeat', addQueryPrefix: true }
    )

  const { json } = await fetcher(endpoint)
  return json
}

export { fetchRunningServices }
