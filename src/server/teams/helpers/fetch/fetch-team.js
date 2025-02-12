import { config } from '~/src/config/config.js'
import { fetchJson } from '~/src/server/common/helpers/fetch/fetch-json.js'

async function fetchTeam(teamId) {
  const endpoint = config.get('userServiceBackendUrl') + `/teams/${teamId}`

  const { payload } = await fetchJson(endpoint)
  return payload
}

export { fetchTeam }
