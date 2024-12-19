import { config } from '~/src/config/config.js'
import { fetcher } from '~/src/server/common/helpers/fetch/fetcher.js'

async function fetchCdpTeams() {
  const endpoint = config.get('userServiceBackendUrl') + '/teams'

  const { data } = await fetcher(endpoint)
  return data
}

export { fetchCdpTeams }
