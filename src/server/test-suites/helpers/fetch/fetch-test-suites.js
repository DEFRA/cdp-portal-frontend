import { config } from '~/src/config/index.js'
import { fetcher } from '~/src/server/common/helpers/fetch/fetcher.js'

async function fetchTestSuites() {
  const endpoint = config.get('portalBackendUrl') + '/test-suite'

  const { json } = await fetcher(endpoint)
  return json
}

export { fetchTestSuites }
