import { config } from '~/src/config/config.js'
import { fetcher } from '~/src/server/common/helpers/fetch/fetcher.js'

/**
 * @param {string|null} teamId
 * @returns {Promise<*>}
 */
async function fetchRepositories(teamId = null) {
  const endpoint =
    config.get('portalBackendUrl') +
    `/repositories${teamId ? `?team=${teamId}` : ''}`

  const { data } = await fetcher(endpoint)
  return data
}

export { fetchRepositories }
