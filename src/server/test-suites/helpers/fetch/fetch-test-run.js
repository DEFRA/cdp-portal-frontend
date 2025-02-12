import { config } from '~/src/config/config.js'
import { fetchJson } from '~/src/server/common/helpers/fetch/fetch-json.js'

async function fetchTestRun(testRunId) {
  const endpoint = config.get('portalBackendUrl') + `/test-run/${testRunId}`

  const { payload } = await fetchJson(endpoint)
  return payload
}

export { fetchTestRun }
