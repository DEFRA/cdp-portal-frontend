import { config } from '~/src/config'
import { fetcher } from '~/src/server/common/helpers/fetch/fetcher'

async function fetchTestSuite(testSuiteId) {
  const endpoint =
    config.get('portalBackendApiUrl') + `/test-suite/${testSuiteId}`

  const { json } = await fetcher(endpoint)
  return json
}

export { fetchTestSuite }
