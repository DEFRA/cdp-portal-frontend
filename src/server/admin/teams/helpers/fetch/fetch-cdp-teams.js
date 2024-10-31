import { config } from '~/src/config/index.js'
import { fetcher } from '~/src/server/common/helpers/fetch/fetcher.js'

async function fetchCdpTeams() {
  const endpoint = config.get('userServiceBackendUrl') + '/teams'

  const { json } = await fetcher(endpoint)
  return json
}

export { fetchCdpTeams }
