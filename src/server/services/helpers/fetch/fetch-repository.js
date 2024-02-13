import { config } from '~/src/config'
import { fetcher } from '~/src/server/common/helpers/fetch/fetcher'

async function fetchRepository(repositoryId) {
  const endpoint =
    config.get('portalBackendApiUrl') + `/repositories/${repositoryId}`

  const { json } = await fetcher(endpoint)
  return json
}

export { fetchRepository }
