import qs from 'qs'
import { config } from '~/src/config'
import { fetcher } from '~/src/server/common/helpers/fetch/fetcher'

async function fetchDeployableImageNames(request) {
  const authedUser = await request.getUserSession()
  const userGroups = authedUser.scope

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
