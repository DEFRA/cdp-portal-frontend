import { config } from '~/src/config/config.js'
import { fetchJson } from '~/src/server/common/helpers/fetch/fetch-json.js'
import qs from 'qs'
import { getUsersTeams } from '~/src/server/common/helpers/user/get-users-teams.js'

const portalBackendUrl = config.get('portalBackendUrl')

async function fetchPostgresServices({ request }) {
  const teams = await getUsersTeams(request)
  if (!teams) {
    return []
  }

  const teamIds = teams.map((t) => t.teamId)

  const endpoint = `${portalBackendUrl}/migrations/services${qs.stringify(
    { teamIds },
    { arrayFormat: 'repeat', addQueryPrefix: true }
  )}`

  const { payload } = await fetchJson(endpoint)
  return payload
}

export { fetchPostgresServices }
