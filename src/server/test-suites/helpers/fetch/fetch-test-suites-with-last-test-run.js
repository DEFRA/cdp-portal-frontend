import { config } from '~/src/config'
import { fetcher } from '~/src/server/common/helpers/fetch/fetcher'

async function fetchTestSuitesWithLastTestRun() {
  const endpoint = config.get('portalBackendUrl') + '/test-suite/test-run'

  const { json } = await fetcher(endpoint)
  return json
}

export { fetchTestSuitesWithLastTestRun }
