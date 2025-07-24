import { config } from '../../../../config/config.js'

import { authedFetchJson } from '../../../common/helpers/fetch/authed-fetch-json.js'

async function fetchScopes(token) {
  const endpoint = config.get('userServiceBackendUrl') + '/scopes'

  const { payload } = await authedFetchJson(endpoint, token)
  return payload
}

export { fetchScopes }
