import { config } from '~/src/config/config.js'
import { fetcher } from '~/src/server/common/helpers/fetch/fetcher.js'

async function fetchInProgress() {
  const endpoint = config.get('selfServiceOpsUrl') + '/status/in-progress'

  const { data } = await fetcher(endpoint)
  return data
}

export { fetchInProgress }
