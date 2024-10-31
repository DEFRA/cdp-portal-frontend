import { config } from '~/src/config/index.js'

/**
 * Is this user in any of our CDP teams that have a github team?
 * Check to see that at least 1 of the users group ids are from a CDP team that has an associated github team
 * @param {{teamId}[]} cdpTeams
 * @param {string[]} userGroups
 * @returns {Promise<boolean>}
 */
function isUserInAServiceTeam(cdpTeams, userGroups) {
  const teamIds = cdpTeams?.map((team) => team.teamId) ?? []

  return userGroups
    .filter((group) => group !== config.get('oidcAdminGroupId'))
    .some((userGroupId) => teamIds?.includes(userGroupId))
}

export { isUserInAServiceTeam }
