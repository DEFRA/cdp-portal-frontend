import { config } from '~/src/config/config.js'
import { fetchJson } from '~/src/server/common/helpers/fetch/fetch-json.js'

async function fetchLegacyServiceStatus(repositoryName) {
  const endpoint = `${config.get('portalBackendUrl')}/legacy-statuses/${repositoryName}`

  const { payload } = await fetchJson(endpoint)
  return payload
}

export { fetchLegacyServiceStatus }
