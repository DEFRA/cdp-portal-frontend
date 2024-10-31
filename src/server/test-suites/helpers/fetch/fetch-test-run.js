import { config } from '~/src/config/index.js'
import { fetcher } from '~/src/server/common/helpers/fetch/fetcher.js'

async function fetchTestRun(testRunId) {
  const endpoint = config.get('portalBackendUrl') + `/test-run/${testRunId}`

  const { json } = await fetcher(endpoint)
  return json
}

export { fetchTestRun }
