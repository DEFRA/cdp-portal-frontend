import { config } from '~/src/config'
import { fetcher } from '~/src/server/common/helpers/fetch/fetcher'

async function fetchInProgress() {
  const endpoint = config.get('selfServiceOpsUrl') + '/status/in-progress'

  const { json } = await fetcher(endpoint)
  return json
}

export { fetchInProgress }
