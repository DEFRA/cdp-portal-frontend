import { config } from '~/src/config/index.js'
import { fetcher } from '~/src/server/common/helpers/fetch/fetcher.js'

async function fetchTestSuites() {
  const endpoint = config.get('portalBackendUrl') + '/test-suite'

  const { data } = await fetcher(endpoint)
  return data
}

export { fetchTestSuites }
