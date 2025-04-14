import qs from 'qs'

import { config } from '~/src/config/config.js'
import { fetchJson } from '~/src/server/common/helpers/fetch/fetch-json.js'

async function fetchInProgressStatus(queryParams = {}) {
  const endpoint =
    config.get('portalBackendUrl') +
    '/legacy-statuses/in-progress' +
    qs.stringify(queryParams, { arrayFormat: 'repeat', addQueryPrefix: true })

  const { payload } = await fetchJson(endpoint)
  return payload
}

export { fetchInProgressStatus }
