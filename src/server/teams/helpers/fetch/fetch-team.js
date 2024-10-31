import { config } from '~/src/config/index.js'
import { fetcher } from '~/src/server/common/helpers/fetch/fetcher.js'

async function fetchTeam(teamId) {
  const endpoint = config.get('userServiceBackendUrl') + `/teams/${teamId}`

  const { json } = await fetcher(endpoint)
  return json
}

export { fetchTeam }
