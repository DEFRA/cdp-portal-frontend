import { config } from '~/src/config'
import { getEnvironments } from '~/src/server/common/helpers/environments/get-environments'

/**
 * Retrieves environments based on the team scope and if an admin scope is available or not.
 *
 * @param {Array} teams - An array of team objects, each containing a `teamId`.
 * @param {string} [oidcAdminGroupId=config.get('oidcAdminGroupId')] - The OIDC admin group ID.
 * @returns {{prod: string, dev: string, test: string, management: string, perfTest: string, infraDev: string}|{prod: string, dev: string, test: string, perfTest: string}}
 */
function getEnvironmentsByTeam(
  teams = [],
  oidcAdminGroupId = config.get('oidcAdminGroupId')
) {
  const isAdmin = teams.map((team) => team.teamId).includes(oidcAdminGroupId)

  return getEnvironments(isAdmin)
}

export { getEnvironmentsByTeam }
