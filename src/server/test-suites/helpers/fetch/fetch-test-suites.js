import { config } from '~/src/config'
import { fetcher } from '~/src/server/common/helpers/fetch/fetcher'

async function fetchTestSuites() {
  const endpoint = config.get('portalBackendUrl') + '/test-suite'

  const { json } = await fetcher(endpoint)
  return json
}

export { fetchTestSuites }
