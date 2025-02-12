import qs from 'qs'
import { config } from '~/src/config/config.js'
import { fetcher } from '~/src/server/common/helpers/fetch/fetcher.js'
import { getUserGroups } from '~/src/server/common/helpers/auth/get-user-groups.js'

/**
 * @typedef {object} Options
 * @property {import('@hapi/hapi').Request} request
 * @property {string} [scope]
 */

/**
 * @summary Fetch images a user can deploy
 * @description A user can deploy images they own. They own an image by being a member of the team that owns a
 * service. There are two ways to obtain these deployable images:
 * 1) Preferred: When request is available use this
 * 2) When request is not available pass in user scope/groups
 * @param {Options} options
 * @returns {Promise<*>}
 */
async function fetchDeployableImageNames({ request, scope }) {
  const userGroups = scope ?? (await getUserGroups(request))

  const endpoint =
    config.get('portalBackendUrl') +
    '/deployables' +
    qs.stringify(
      { runMode: 'service', groups: userGroups },
      { arrayFormat: 'repeat', addQueryPrefix: true }
    )

  const { payload } = await fetcher(endpoint)
  return payload
}

export { fetchDeployableImageNames }
