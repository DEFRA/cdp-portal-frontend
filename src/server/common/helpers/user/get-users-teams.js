import { fetchCdpTeams } from '../../../teams/helpers/fetch/fetch-cdp-teams.js'

/**
 * Returns a list of teams the user is a member of.
 * If the user is in the admin group then it returns a list of all teams.
 * @param {{}} request
 * @returns {Promise<[{teamId: string, github: string}]>}
 */
export async function getUsersTeams(request) {
  const userSession = request.auth.credentials
  const scopes = userSession?.scope

  // TODO we need to consider pagination here in the future
  const teams = await fetchCdpTeams(true)

  if (userSession?.isAdmin) {
    return teams
  }

  return scopes
    .map((scope) => teams.find((team) => `team:${team.teamId}` === scope))
    .filter(Boolean)
}

export function getUserTeamsUnexpanded(request) {
  const scopes = request.auth?.credentials?.scope ?? []

  return scopes
    .filter((s) => s.startsWith('team:'))
    .map((s) => s.replace('team:', ''))
}
