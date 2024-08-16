import { config } from '~/src/config'
import { fetcher } from '~/src/server/common/helpers/fetch/fetcher'

async function fetchTestRun(testRunId) {
  const endpoint = config.get('portalBackendUrl') + `/test-run/${testRunId}`

  const { json } = await fetcher(endpoint)
  return json
}

export { fetchTestRun }
