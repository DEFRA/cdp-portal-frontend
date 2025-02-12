import { config } from '~/src/config/config.js'
import { fetchJson } from '~/src/server/common/helpers/fetch/fetch-json.js'

async function fetchTestSuites() {
  const endpoint = config.get('portalBackendUrl') + '/test-suite'

  const { payload } = await fetchJson(endpoint)
  return payload
}

export { fetchTestSuites }
