import { config } from '../../../config/config.js'
import { fetchJson } from '../../common/helpers/fetch/fetch-json.js'
import qs from 'qs'
import { getUsersTeams } from '../../common/helpers/user/get-users-teams.js'

const portalBackendUrl = config.get('portalBackendUrl')

async function fetchPostgresServices({ request }) {
  const userSession = request.getUserSession()

  // Admins can view all migrations
  if (userSession.isAdmin) {
    const endpoint = `${portalBackendUrl}/migrations/services`
    const { payload } = await fetchJson(endpoint)
    return payload
  }

  // Only return results for the services owned by the user.
  const teams = await getUsersTeams(request)

  // Users not in a team cannot see anything.
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
