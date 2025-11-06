/** @constant {string} */
const gitHubOrg = 'https://github.com/DEFRA'

/**
 * @typedef {object} ActionDetail
 * @property {string} text - action name
 * @property {string} href - action href
 */

/**
 *
 * @returns {ActionDetail[]}
 */
export function getActions() {
  return [
    {
      text: 'cdp-tenant-config',
      href: `${gitHubOrg}/cdp-tenant-config/actions/workflows/remove-service.yml`
    }
  ]
}
