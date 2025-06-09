import { config } from '~/src/config/config.js'
import { fetchJson } from '~/src/server/common/helpers/fetch/fetch-json.js'

async function fetchRepository(repositoryId) {
  const endpoint =
    config.get('portalBackendUrl') + `/repositories/${repositoryId}`

  const { payload } = await fetchJson(endpoint)
  return payload
}

export { fetchRepository }
