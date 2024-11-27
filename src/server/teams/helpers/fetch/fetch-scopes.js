import { config } from '~/src/config/index.js'

async function fetchScopes(request) {
  const endpoint = config.get('userServiceBackendUrl') + `/scopes`

  const response = await request.authedFetcher(endpoint)

  return response.data
}

export { fetchScopes }
