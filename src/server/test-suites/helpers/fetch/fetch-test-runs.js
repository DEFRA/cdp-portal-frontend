import { config } from '~/src/config'
import { fetcher } from '~/src/server/common/helpers/fetch/fetcher'

async function fetchTestRuns(testSuiteName) {
  const endpoint =
    config.get('portalBackendApiUrl') + `/test-run?name=${testSuiteName}`

  const { json } = await fetcher(endpoint)
  return json
}

export { fetchTestRuns }
