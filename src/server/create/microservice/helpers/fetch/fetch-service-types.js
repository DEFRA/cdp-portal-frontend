import { config } from '~/src/config'
import { fetcher } from '~/src/server/common/helpers/fetch/fetcher'

async function fetchServiceTypes() {
  const endpoint = config.get('portalBackendApiUrl') + '/service-types'

  const { json } = await fetcher(endpoint)
  return json
}

export { fetchServiceTypes }
