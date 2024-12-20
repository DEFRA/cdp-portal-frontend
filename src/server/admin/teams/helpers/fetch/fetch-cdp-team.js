import { config } from '~/src/config/config.js'
import { fetcher } from '~/src/server/common/helpers/fetch/fetcher.js'

async function fetchCdpTeam(teamId) {
  const endpoint = config.get('userServiceBackendUrl') + `/teams/${teamId}`

  const { data } = await fetcher(endpoint)
  return data
}

export { fetchCdpTeam }
