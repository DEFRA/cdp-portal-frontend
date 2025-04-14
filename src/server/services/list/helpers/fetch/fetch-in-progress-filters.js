import qs from 'qs'

import { config } from '~/src/config/config.js'
import { fetchJson } from '~/src/server/common/helpers/fetch/fetch-json.js'
import { nullify404 } from '~/src/server/common/helpers/nullify-404.js'

async function fetchInProgressFilters(queryParams = {}) {
  const endpoint =
    config.get('portalBackendUrl') +
    '/legacy-statuses/in-progress/filters' +
    qs.stringify(queryParams, { arrayFormat: 'repeat', addQueryPrefix: true })

  const response = await fetchJson(endpoint).catch(nullify404)

  return response?.payload ?? null
}

export { fetchInProgressFilters }
