import qs from 'qs'

import { config } from '~/src/config'
import { fetcher } from '~/src/server/common/helpers/fetch/fetcher'

async function fetchRunningServices(environments) {
  const endpoint =
    config.get('portalBackendApiUrl') +
    '/whats-running-where' +
    qs.stringify(
      { environments: Object.values(environments) },
      { arrayFormat: 'repeat', addQueryPrefix: true }
    )

  const { json } = await fetcher(endpoint)
  return json
}

export { fetchRunningServices }
