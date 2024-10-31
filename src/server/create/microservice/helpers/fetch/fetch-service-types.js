import { config } from '~/src/config/index.js'
import { fetcher } from '~/src/server/common/helpers/fetch/fetcher.js'

async function fetchServiceTypes() {
  const endpoint = config.get('portalBackendUrl') + '/service-types'

  const { json } = await fetcher(endpoint)
  return json
}

export { fetchServiceTypes }
