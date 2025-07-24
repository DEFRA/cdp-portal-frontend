import { config } from '../../../../config/config.js'
import { fetchJson } from './fetch-json.js'

async function fetchRepository(repositoryId) {
  const endpoint =
    config.get('portalBackendUrl') + `/repositories/${repositoryId}`

  const { payload } = await fetchJson(endpoint)
  return payload
}

export { fetchRepository }
