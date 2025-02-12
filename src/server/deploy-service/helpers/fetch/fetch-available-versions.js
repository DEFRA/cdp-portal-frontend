import { config } from '~/src/config/config.js'
import { fetcher } from '~/src/server/common/helpers/fetch/fetcher.js'

async function fetchAvailableVersions(serviceName) {
  const endpoint =
    config.get('portalBackendUrl') + `/deployables/${serviceName}`

  const { payload } = await fetcher(endpoint)

  return payload.filter((version) => version.tag !== '0.0.0')
}

export { fetchAvailableVersions }
