import { config } from '~/src/config/index.js'
import { fetcher } from '~/src/server/common/helpers/fetch/fetcher.js'

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
