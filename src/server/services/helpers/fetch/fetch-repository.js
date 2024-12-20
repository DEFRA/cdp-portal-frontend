import { config } from '~/src/config/config.js'
import { fetcher } from '~/src/server/common/helpers/fetch/fetcher.js'

async function fetchRepository(repositoryId) {
  const endpoint =
    config.get('portalBackendUrl') + `/repositories/${repositoryId}`

  const { data } = await fetcher(endpoint)
  return data
}

export { fetchRepository }
