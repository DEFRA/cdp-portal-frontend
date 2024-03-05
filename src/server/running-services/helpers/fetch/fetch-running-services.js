import qs from 'qs'

import { config } from '~/src/config'
import { fetcher } from '~/src/server/common/helpers/fetch/fetcher'

async function fetchRunningServices(envs) {
  const endpoint =
    config.get('portalBackendApiUrl') +
    '/whats-running-where' +
    qs.stringify(
      { envs: Object.values(envs) },
      { arrayFormat: 'repeat', addQueryPrefix: true }
    )

  const { json } = await fetcher(endpoint)
  return json
}

export { fetchRunningServices }
