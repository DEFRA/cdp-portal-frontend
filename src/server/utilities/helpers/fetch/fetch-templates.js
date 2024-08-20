import { config } from '~/src/config'
import { fetcher } from '~/src/server/common/helpers/fetch/fetcher'

/**
 * @param {string|null} [teamId] = null
 * @returns {Promise<*>}
 */
async function fetchTemplates(teamId = null) {
  const endpoint =
    config.get('portalBackendUrl') +
    `/templates${teamId ? `?team=${teamId}` : ''}`

  const { json } = await fetcher(endpoint)
  return json
}

export { fetchTemplates }
