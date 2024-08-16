import { config } from '~/src/config'
import { fetcher } from '~/src/server/common/helpers/fetch/fetcher'

async function fetchAllSecrets(serviceName) {
  try {
    const endpoint = config.get('portalBackendUrl') + `/secrets/${serviceName}`
    const { json } = await fetcher(endpoint)

    return json
  } catch (error) {
    return {}
  }
}

export { fetchAllSecrets }
