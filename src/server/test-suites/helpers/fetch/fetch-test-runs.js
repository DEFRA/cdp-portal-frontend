import { config } from '~/src/config/config.js'
import { fetchJson } from '~/src/server/common/helpers/fetch/fetch-json.js'

async function fetchTestRuns(testSuiteName) {
  const endpoint =
    config.get('portalBackendUrl') + `/test-run?name=${testSuiteName}`

  const { payload } = await fetchJson(endpoint)
  return payload
}

export { fetchTestRuns }
