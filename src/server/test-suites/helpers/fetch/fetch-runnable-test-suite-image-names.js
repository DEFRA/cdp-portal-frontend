import qs from 'qs'

import { config } from '~/src/config'
import { fetcher } from '~/src/server/common/helpers/fetch/fetcher'
import { getUserGroups } from '~/src/server/common/helpers/auth/get-user-groups'

async function fetchRunnableTestSuiteImageNames(request) {
  const userGroups = await getUserGroups(request)

  const endpoint =
    config.get('portalBackendUrl') +
    '/deployables' +
    qs.stringify(
      { runMode: 'job', groups: userGroups },
      { arrayFormat: 'repeat', addQueryPrefix: true }
    )

  const { json } = await fetcher(endpoint)
  return json
}

export { fetchRunnableTestSuiteImageNames }
