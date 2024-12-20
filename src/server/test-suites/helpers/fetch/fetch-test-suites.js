import { config } from '~/src/config/config.js'
import { fetcher } from '~/src/server/common/helpers/fetch/fetcher.js'

async function fetchTestSuites() {
  const endpoint = config.get('portalBackendUrl') + '/test-suite'

  const { data } = await fetcher(endpoint)
  return data
}

export { fetchTestSuites }
