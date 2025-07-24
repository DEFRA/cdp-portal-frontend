import qs from 'qs'

import { config } from '../../../../config/config.js'
import { fetchJson } from './fetch-json.js'

async function fetchFilters(queryParams = {}) {
  const endpoint =
    config.get('portalBackendUrl') +
    '/entities/filters' +
    qs.stringify(queryParams, { arrayFormat: 'repeat', addQueryPrefix: true })

  const { payload } = await fetchJson(endpoint)
  return payload ?? []
}

export { fetchFilters }
