import { config } from '~/src/config'

async function fetchEnvironments(request) {
  const endpoint = config.get('portalBackendApiUrl') + '/environments'

  const { json } = await request.authedFetcher(endpoint)

  return json
}

export { fetchEnvironments }
