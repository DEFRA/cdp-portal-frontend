import { config } from '~/src/config/config.js'
import { fetchJson } from '~/src/server/common/helpers/fetch/fetch-json.js'

/**
 * @param {string|null} teamId
 * @returns {Promise<*>}
 */
async function fetchRepositories(teamId = null) {
  const endpoint =
    config.get('portalBackendUrl') +
    `/repositories${teamId ? `?team=${teamId}` : ''}`

  const { payload } = await fetchJson(endpoint)
  return payload
}

export { fetchRepositories }
