import { config } from '~/src/config'
import { fetcher } from '~/src/server/common/helpers/fetch/fetcher'

async function fetchAvailableVersions(serviceName) {
  const endpoint =
    config.get('portalBackendApiUrl') + `/deployables/${serviceName}`

  const { json } = await fetcher(endpoint)

  return json.filter((version) => version !== '0.0.0')
}

export { fetchAvailableVersions }
