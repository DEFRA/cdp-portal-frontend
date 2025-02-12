import { config } from '~/src/config/config.js'
import { fetcher } from '~/src/server/common/helpers/fetch/fetcher.js'

async function fetchServiceTypes() {
  const endpoint = config.get('portalBackendUrl') + '/service-types'

  const { payload } = await fetcher(endpoint)
  return payload
}

export { fetchServiceTypes }
