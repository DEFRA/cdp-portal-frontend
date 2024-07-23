import { config } from '~/src/config'
import { fetcher } from '~/src/server/common/helpers/fetch/fetcher'

async function fetchInProgress() {
  const endpoint = config.get('selfServiceOpsApiUrl') + '/status/in-progress'
  try {
    const { json } = await fetcher(endpoint)
    return json
  } catch (error) {
    return {}
  }
}

export { fetchInProgress }
