import { config } from '~/src/config'
import { fetcher } from '~/src/server/common/helpers/fetch/fetcher'

async function fetchAvailableVersions(serviceName) {
  const endpoint =
    config.get('portalBackendUrl') + `/deployables/${serviceName}`

  const { json } = await fetcher(endpoint)

  return json.filter((version) => version.tag !== '0.0.0')
}

export { fetchAvailableVersions }
