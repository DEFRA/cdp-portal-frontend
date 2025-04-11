import qs from 'qs'

import { config } from '~/src/config/config.js'
import { fetchJson } from '~/src/server/common/helpers/fetch/fetch-json.js'

async function fetchTestSuites(teamId = null) {
  const portalBackendUrl = config.get('portalBackendUrl')

  const endpoint =
    portalBackendUrl +
    '/test-suites' +
    (teamId ? qs.stringify({ teamId }, { addQueryPrefix: true }) : '')

  const { payload } = await fetchJson(endpoint)
  return payload
}

export { fetchTestSuites }
