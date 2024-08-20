import { config } from '~/src/config'

/**
 * Checks if the service is owned by an admin based on team scopes.
 * @param {Array} teamScopes - An array of scopes associated with the team.
 * @param {string} [oidcAdminGroupId] - The OIDC admin group ID. Defaults to config.get('oidcAdminGroupId')
 * @returns {boolean} True if the team scopes include the OIDC admin group ID, otherwise false.
 */
function adminOwnedService(
  teamScopes = [],
  oidcAdminGroupId = config.get('oidcAdminGroupId')
) {
  return teamScopes.includes(oidcAdminGroupId)
}

export { adminOwnedService }
