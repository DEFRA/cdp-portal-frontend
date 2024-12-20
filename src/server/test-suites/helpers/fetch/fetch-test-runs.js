import { config } from '~/src/config/index.js'
import { fetcher } from '~/src/server/common/helpers/fetch/fetcher.js'

async function fetchTestRuns(testSuiteName) {
  const endpoint =
    config.get('portalBackendUrl') + `/test-run?name=${testSuiteName}`

  const { data } = await fetcher(endpoint)
  return data
}

export { fetchTestRuns }
