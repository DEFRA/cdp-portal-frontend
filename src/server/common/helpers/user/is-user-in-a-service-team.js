import { config } from '~/src/config'

/**
 * Is this user in any of our CDP teams that have a github team?
 * Check to see that at least 1 of the users group ids are from a CDP team that has an associated github team
 *
 * @param cdpTeams
 * @param userGroups
 * @returns {Promise<boolean>}
 */
async function isUserInAServiceTeam(cdpTeams, userGroups) {
  const teamIds = cdpTeams?.map((team) => team.teamId) ?? []

  return userGroups
    .filter((group) => group !== config.get('oidcAdminGroupId'))
    .some((userGroupId) => teamIds?.includes(userGroupId))
}

export { isUserInAServiceTeam }
