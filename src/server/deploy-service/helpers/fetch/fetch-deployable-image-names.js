import qs from 'qs'
import { config } from '~/src/config'
import { fetcher } from '~/src/server/common/helpers/fetch/fetcher'
import { getUserGroups } from '~/src/server/common/helpers/auth/get-user-groups'

/**
 * @summary Fetch images a user can deploy
 * @description A user can deploy images they own. They own an image by being a member of the team that owns a
 * service. There are two ways to obtain these deployable images:
 * 1) Preferred: When request is available use this
 * 2) When request is not available pass in user scope/groups
 *
 * @param request
 * @param scope
 * @returns {Promise<*>}
 */
async function fetchDeployableImageNames({ request, scope }) {
  const userGroups = scope ?? (await getUserGroups(request))

  const endpoint =
    config.get('portalBackendApiUrl') +
    '/deployables' +
    qs.stringify(
      { runMode: 'service', groups: userGroups },
      { arrayFormat: 'repeat', addQueryPrefix: true }
    )

  const { json } = await fetcher(endpoint)
  return json
}

export { fetchDeployableImageNames }
