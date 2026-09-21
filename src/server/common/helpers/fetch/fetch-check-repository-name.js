import { config } from '#config/config.js'
import { fetchJson } from './fetch-json.js'

async function fetchCheckRepositoryName(repositoryId) {
  const endpoint =
    config.get('portalBackendUrl') + `/check-repository-exists/${repositoryId}`

  const { payload } = await fetchJson(endpoint)
  return payload
}

export { fetchCheckRepositoryName }
