import { config } from '~/src/config/config.js'

import { authedFetcher } from '~/src/server/common/helpers/fetch/authed-fetcher.js'

async function fetchScopes(token) {
  const endpoint = config.get('userServiceBackendUrl') + `/scopes`

  const { payload } = await authedFetcher(endpoint, token)
  return payload
}

export { fetchScopes }
