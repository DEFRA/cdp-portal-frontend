import { config } from '~/src/config/index.js'
import { fetcher } from '~/src/server/common/helpers/fetch/fetcher.js'

/**
 * @param {string|null} teamId
 * @returns {Promise<*>}
 */
async function fetchRepositories(teamId = null) {
  const endpoint =
    config.get('portalBackendUrl') +
    `/repositories${teamId ? `?team=${teamId}` : ''}`

  const { json } = await fetcher(endpoint)
  return json
}

export { fetchRepositories }
