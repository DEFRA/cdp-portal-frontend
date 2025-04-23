import { config } from '~/src/config/config.js'
import { fetchJson } from '~/src/server/common/helpers/fetch/fetch-json.js'

const portalBackendUrl = config.get('portalBackendUrl')

async function fetchTeamRepositories(teamId) {
  const endpoint = portalBackendUrl + `/repositories/all/${teamId}`

  const { payload } = await fetchJson(endpoint)
  return payload
}

export { fetchTeamRepositories }
