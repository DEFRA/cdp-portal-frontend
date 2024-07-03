import { config } from '~/src/config'
import { fetcher } from '~/src/server/common/helpers/fetch/fetcher'

async function fetchSecrets(environment, serviceName) {
  const endpoint =
    config.get('portalBackendApiUrl') + `/secrets/${environment}/${serviceName}`

  const { json } = await fetcher(endpoint)
  return json
}

export { fetchSecrets }
