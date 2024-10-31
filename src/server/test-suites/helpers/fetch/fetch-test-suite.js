import { config } from '~/src/config/index.js'
import { fetcher } from '~/src/server/common/helpers/fetch/fetcher.js'

async function fetchTestSuite(testSuiteId) {
  const endpoint = config.get('portalBackendUrl') + `/test-suite/${testSuiteId}`

  const { json } = await fetcher(endpoint)
  return json
}

export { fetchTestSuite }
