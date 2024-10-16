import { config } from '~/src/config'
import { fetcher } from '~/src/server/common/helpers/fetch/fetcher'

async function fetchCdpTeams() {
  const endpoint = config.get('userServiceBackendUrl') + '/teams'

  const { json } = await fetcher(endpoint)
  return json
}

export { fetchCdpTeams }
