import { config } from '~/src/config/config.js'
import { fetchJson } from '~/src/server/common/helpers/fetch/fetch-json.js'

async function fetchCreateServiceStatus(repositoryName) {
  const endpoint = config.get('selfServiceOpsUrl') + `/status/${repositoryName}`

  const { payload } = await fetchJson(endpoint)
  return payload
}

export { fetchCreateServiceStatus }
