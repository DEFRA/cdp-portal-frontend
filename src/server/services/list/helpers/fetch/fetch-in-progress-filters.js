import qs from 'qs'

import { config } from '~/src/config/config.js'
import { fetcher } from '~/src/server/common/helpers/fetch/fetcher.js'

async function fetchInProgressFilters(queryParams = {}) {
  const endpoint =
    config.get('selfServiceOpsUrl') +
    '/status/in-progress/filters' +
    qs.stringify(queryParams, { arrayFormat: 'repeat', addQueryPrefix: true })

  const { data } = await fetcher(endpoint)
  return data
}

export { fetchInProgressFilters }
