import { config } from '~/src/config/config.js'
import { fetcher } from '~/src/server/common/helpers/fetch/fetcher.js'

async function fetchTestRuns(testSuiteName) {
  const endpoint =
    config.get('portalBackendUrl') + `/test-run?name=${testSuiteName}`

  const { payload } = await fetcher(endpoint)
  return payload
}

export { fetchTestRuns }
