import qs from 'qs'

import { config } from '~/src/config/index.js'
import { fetcher } from '~/src/server/common/helpers/fetch/fetcher.js'
import { getUserGroups } from '~/src/server/common/helpers/auth/get-user-groups.js'

async function fetchRunnableTestSuiteImageNames(request) {
  const userGroups = await getUserGroups(request)

  const endpoint =
    config.get('portalBackendUrl') +
    '/deployables' +
    qs.stringify(
      { runMode: 'job', groups: userGroups },
      { arrayFormat: 'repeat', addQueryPrefix: true }
    )

  const { data } = await fetcher(endpoint)
  return data
}

export { fetchRunnableTestSuiteImageNames }
