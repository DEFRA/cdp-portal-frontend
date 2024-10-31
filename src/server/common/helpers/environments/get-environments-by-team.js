import { config } from '~/src/config/index.js'
import { getEnvironments } from '~/src/server/common/helpers/environments/get-environments.js'

/**
 * @typedef {string[]} AdminEnvironments
 * @property {string} prod
 * @property {string} dev
 * @property {string} test
 * @property {string} perfTest
 * @property {string} management
 * @property {string} infraDev
 */

/**
 * @typedef {string[]} TenantEnvironments = Omit<AdminEnvironments, 'management', 'infraDev'>
 */

/**
 * Retrieves environments based on the team scope and if an admin scope is available or not.
 * @param {Array} teams - An array of team objects, each containing a `teamId`.
 * @param {string} [oidcAdminGroupId] - The OIDC admin group ID. Defaults to config.get('oidcAdminGroupId')
 * @returns {{AdminEnvironments}|{TenantEnvironments}}
 */
function getEnvironmentsByTeam(
  teams = [],
  oidcAdminGroupId = config.get('oidcAdminGroupId')
) {
  const isAdmin = teams.map((team) => team.teamId).includes(oidcAdminGroupId)

  return getEnvironments(isAdmin)
}

export { getEnvironmentsByTeam }
