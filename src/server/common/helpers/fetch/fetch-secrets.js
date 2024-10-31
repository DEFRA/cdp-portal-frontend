import { config } from '~/src/config/index.js'
import { fetcher } from '~/src/server/common/helpers/fetch/fetcher.js'

async function fetchSecrets(environment, serviceName) {
  try {
    const endpoint =
      config.get('portalBackendUrl') + `/secrets/${environment}/${serviceName}`
    const { json } = await fetcher(endpoint)

    return json
  } catch (error) {
    return null
  }
}

export { fetchSecrets }
