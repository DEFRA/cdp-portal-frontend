import { config } from '~/src/config'

/**
 * Is this user in a CDP team that has a github team
 * Check to see that at least 1 of the users group ids are from a CDP team that has an associated github team
 *
 * @param cdpTeams
 * @param userGroups
 * @returns {Promise<boolean>}
 */
async function isUserInServiceTeam(cdpTeams, userGroups) {
  const teamIds = cdpTeams?.map((team) => team.teamId) ?? []

  return userGroups
    .filter((group) => group !== config.get('oidcAdminGroupId'))
    .some((userGroupId) => teamIds?.includes(userGroupId))
}

export { isUserInServiceTeam }
