import { config } from '~/src/config/index.js'
import { fetcher } from '~/src/server/common/helpers/fetch/fetcher.js'

async function fetchRepository(repositoryId) {
  const endpoint =
    config.get('portalBackendUrl') + `/repositories/${repositoryId}`

  const { json } = await fetcher(endpoint)
  return json
}

export { fetchRepository }
