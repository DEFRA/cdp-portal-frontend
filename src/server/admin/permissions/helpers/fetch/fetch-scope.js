import { config } from '~/src/config/index.js'
import { fetcher } from '~/src/server/common/helpers/fetch/fetcher.js'

async function fetchScope(teamId) {
  const endpoint = config.get('userServiceBackendUrl') + `/teams/${teamId}`

  const { data } = await fetcher(endpoint)
  return data
}

export { fetchScope }
