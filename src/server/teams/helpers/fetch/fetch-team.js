import { config } from '~/src/config/config.js'
import { fetcher } from '~/src/server/common/helpers/fetch/fetcher.js'

async function fetchTeam(teamId) {
  const endpoint = config.get('userServiceBackendUrl') + `/teams/${teamId}`

  const { payload } = await fetcher(endpoint)
  return payload
}

export { fetchTeam }
