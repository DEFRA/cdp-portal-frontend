import { fetchTeams } from '~/src/server/teams/helpers/fetch-teams'

/**
 * Is this user in a CDP team that has a github team
 * Check to see that at least 1 of the users group ids are from a CDP team that has an associated github team
 *
 * @param userGroups
 * @returns {Promise<boolean>}
 */
async function isUserInServiceTeam(userGroups) {
  // TODO pagination on teams
  const { teams } = await fetchTeams(true)
  const teamIds = teams?.map((team) => team.teamId)

  return userGroups.some((userGroupId) => teamIds.includes(userGroupId))
}

export { isUserInServiceTeam }
