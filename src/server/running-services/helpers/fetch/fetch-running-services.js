import qs from 'qs'

import { config } from '~/src/config/config.js'
import { fetchJson } from '~/src/server/common/helpers/fetch/fetch-json.js'

async function fetchRunningServices(environments, queryParams = {}) {
  const endpoint =
    config.get('portalBackendUrl') +
    '/running-services' +
    qs.stringify(
      { environments, ...queryParams },
      { arrayFormat: 'repeat', addQueryPrefix: true }
    )

  const { payload } = await fetchJson(endpoint)
  return payload
}

export { fetchRunningServices }
