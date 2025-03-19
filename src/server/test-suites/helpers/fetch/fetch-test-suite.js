import { config } from '~/src/config/config.js'
import { fetchJson } from '~/src/server/common/helpers/fetch/fetch-json.js'

async function fetchTestSuite(testSuiteId) {
  const endpoint =
    config.get('portalBackendUrl') + `/test-suites/${testSuiteId}`

  const { payload } = await fetchJson(endpoint)
  return payload
}

export { fetchTestSuite }
