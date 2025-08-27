import { fetchTeams } from '../../../teams/helpers/fetch/fetch-teams.js'

/**
 * Returns a list of teams the user is a member of.
 * If the user is in the admin group then it returns a list of all teams.
 * @param {{}} request
 * @returns {Promise<[{teamId: string, github: string}]>}
 */
async function getUsersTeams(request) {
  const userSession = await request.getUserSession()
  const scopes = userSession?.scope

  // TODO we need to consider pagination here in the future
  const { teams } = await fetchTeams(true)

  if (userSession?.isAdmin) {
    return teams
  }

  return scopes
    .map((scope) => teams.find((team) => `team:${team.teamId}` === scope))
    .filter(Boolean)
}

export { getUsersTeams }
