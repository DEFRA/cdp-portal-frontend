import { config } from '~/src/config/config.js'

import { authedFetchJson } from '~/src/server/common/helpers/fetch/authed-fetch-json.js'

async function fetchScopes(token) {
  const endpoint = config.get('userServiceBackendUrl') + '/scopes'

  const { payload } = await authedFetchJson(endpoint, token)
  return payload
}

export { fetchScopes }
