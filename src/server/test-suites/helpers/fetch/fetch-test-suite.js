import { config } from '~/src/config/config.js'
import { fetcher } from '~/src/server/common/helpers/fetch/fetcher.js'

async function fetchTestSuite(testSuiteId) {
  const endpoint = config.get('portalBackendUrl') + `/test-suite/${testSuiteId}`

  const { payload } = await fetcher(endpoint)
  return payload
}

export { fetchTestSuite }
