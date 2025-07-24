import { fetchTeams } from '../../../teams/helpers/fetch/fetch-teams.js'

/**
 * Returns a list of teams the user is a member of.
 * If the user is in the admin group then it returns a list of all teams.
 * @param {{}} request
 * @returns {Promise<[{teamId: string, github: string}]>}
 */
async function getUsersTeams(request) {
  const authedUser = await request.getUserSession()
  const userGroups = authedUser.scope

  // TODO we need to consider pagination here in the future
  const { teams } = await fetchTeams(true)

  if (authedUser.isAdmin) {
    return teams
  }

  return userGroups
    .map((userGroupId) => teams.find((team) => team.teamId === userGroupId))
    .filter(Boolean)
}

export { getUsersTeams }
