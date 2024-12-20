import { config } from '~/src/config/config.js'
import { fetcher } from '~/src/server/common/helpers/fetch/fetcher.js'

async function fetchTestRun(testRunId) {
  const endpoint = config.get('portalBackendUrl') + `/test-run/${testRunId}`

  const { data } = await fetcher(endpoint)
  return data
}

export { fetchTestRun }
