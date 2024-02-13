import qs from 'qs'
import { config } from '~/src/config'
import { fetcher } from '~/src/server/common/helpers/fetch/fetcher'
import { getUserGroups } from '~/src/server/common/helpers/auth/get-user-groups'

async function fetchDeployableImageNames(request) {
  const userGroups = await getUserGroups(request)

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
