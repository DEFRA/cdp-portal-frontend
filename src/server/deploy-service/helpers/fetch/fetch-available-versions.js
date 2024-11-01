import { config } from '~/src/config/index.js'
import { fetcher } from '~/src/server/common/helpers/fetch/fetcher.js'

async function fetchAvailableVersions(serviceName) {
  const endpoint =
    config.get('portalBackendUrl') + `/deployables/${serviceName}`

  const { data } = await fetcher(endpoint)

  return data.filter((version) => version.tag !== '0.0.0')
}

export { fetchAvailableVersions }
