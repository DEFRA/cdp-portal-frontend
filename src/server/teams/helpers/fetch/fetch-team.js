import { config } from '~/src/config'
import { fetcher } from '~/src/server/common/helpers/fetch/fetcher'

async function fetchTeam(teamId) {
  const endpoint = config.get('userServiceApiUrl') + `/teams/${teamId}`

  const { json } = await fetcher(endpoint)
  return json
}

export { fetchTeam }
