import { config } from '~/src/config/index.js'

import { fetcher } from '~/src/server/common/helpers/fetch/fetcher.js'

async function fetchScopes() {
  const endpoint = config.get('userServiceBackendUrl') + '/scopes/admin'

  const { data } = await fetcher(endpoint)
  return data
}

export { fetchScopes }
